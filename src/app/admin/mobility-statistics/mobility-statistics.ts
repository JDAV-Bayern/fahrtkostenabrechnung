import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  CourseMobilityStatisticsDTO,
  FeedbackService,
  MobilityStatisticsDTO,
} from 'src/app/feedback/feedback-service';
import { Button } from 'src/app/shared/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from 'src/app/shared/ui/card';
import * as XLSX from 'xlsx-js-style';

const TRANSPORT_COLORS: Record<string, string> = {
  'fair-means': '#20912A',
  zug: '#EB3FCE',
  'pkw (elektro)': '#34C3E3',
  'pkw (hybrid)': '#E81F00',
  'pkw (verbrenner)': '#66261E',
  'pkw-fahrg': '#EEFA14',
};

const TRANSPORT_LABELS: Record<string, string> = {
  'fair-means': 'Zu Fuß / Fahrrad',
  zug: 'ÖPNV',
  'pkw (elektro)': 'PKW (Elektro)',
  'pkw (hybrid)': 'PKW (Hybrid)',
  'pkw (verbrenner)': 'PKW (Verbrenner)',
  'pkw-fahrg': 'Mitfahrer*in in Fahrgemeinschaft',
};

function labelFor(mode: string): string {
  const key = mode.toLowerCase();
  return TRANSPORT_LABELS[key] ?? mode.charAt(0).toUpperCase() + mode.slice(1);
}

function colorFor(mode: string): string {
  const key = mode.toLowerCase();
  return TRANSPORT_COLORS[key] ?? '#94a3b8';
}

interface PieSegment {
  mode: string;
  label: string;
  count: number;
  percentage: number;
  path: string;
  color: string;
  isFullCircle: boolean;
}

interface BarEntry {
  mode: string;
  label: string;
  count: number;
  widthPct: number;
  color: string;
}

@Component({
  selector: 'jdav-mobility-statistics',
  imports: [Button, Card, CardContent, CardHeader, CardTitle, DecimalPipe],
  templateUrl: './mobility-statistics.html',
  styleUrl: './mobility-statistics.css',
  standalone: true,
})
export class MobilityStatistics {
  feedbackService = inject(FeedbackService);

  mobilityData = signal<MobilityStatisticsDTO | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.feedbackService.getMobilityStatistics().subscribe({
      next: (data) => {
        this.mobilityData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Fehler beim Laden der Daten: ' + (err.message ?? ''));
        this.loading.set(false);
      },
    });
  }

  pieSegments = computed<PieSegment[]>(() => {
    const data = this.mobilityData();
    if (!data) return [];

    const entries = this.allModes().map((mode) => [
      mode,
      data.total_per_mean_of_transport[mode] ?? 0,
    ]) as [string, number][];
    if (!entries.length) return [];

    const total = entries.reduce((sum, [, value]) => sum + value, 0);
    if (total <= 0) return [];
    const cx = 120,
      cy = 120,
      r = 100,
      ir = 58;

    if (entries.length === 1) {
      return [
        {
          mode: entries[0][0],
          label: labelFor(entries[0][0]),
          count: entries[0][1],
          percentage: 100,
          path: '',
          color: this.colorForMode(entries[0][0]),
          isFullCircle: true,
        },
      ];
    }

    let angle = -Math.PI / 2;
    return entries.map(([mode, count]) => {
      const slice = (count / total) * 2 * Math.PI;
      const sa = angle;
      const ea = angle + slice;
      angle = ea;

      const f = (v: number) => v.toFixed(2);
      const x1 = cx + r * Math.cos(sa);
      const y1 = cy + r * Math.sin(sa);
      const x2 = cx + r * Math.cos(ea);
      const y2 = cy + r * Math.sin(ea);
      const ix1 = cx + ir * Math.cos(sa);
      const iy1 = cy + ir * Math.sin(sa);
      const ix2 = cx + ir * Math.cos(ea);
      const iy2 = cy + ir * Math.sin(ea);
      const large = slice > Math.PI ? 1 : 0;

      const path =
        `M ${f(ix1)} ${f(iy1)} L ${f(x1)} ${f(y1)}` +
        ` A ${r} ${r} 0 ${large} 1 ${f(x2)} ${f(y2)}` +
        ` L ${f(ix2)} ${f(iy2)} A ${ir} ${ir} 0 ${large} 0 ${f(ix1)} ${f(iy1)} Z`;

      return {
        mode,
        label: labelFor(mode),
        count,
        percentage: Math.round((count / total) * 100),
        path,
        color: this.colorForMode(mode),
        isFullCircle: false,
      };
    });
  });

  barEntries = computed<BarEntry[]>(() => {
    const data = this.mobilityData();
    if (!data) return [];

    const entries = this.allModes().map((mode) => [
      mode,
      data.total_per_mean_of_transport[mode] ?? 0,
    ]) as [string, number][];
    const max = Math.max(...entries.map(([, count]) => count), 1);

    return entries.map(([mode, count]) => ({
      mode,
      label: labelFor(mode),
      count,
      widthPct: (count / max) * 100,
      color: this.colorForMode(mode),
    }));
  });

  topTransport = computed(() => {
    const data = this.mobilityData();
    if (!data) return null;
    const entries = Object.entries(data.total_per_mean_of_transport);
    if (!entries.length) return null;
    const [mode, count] = entries.sort(([, a], [, b]) => b - a)[0];
    return { label: labelFor(mode), count };
  });

  totalTransportKm = computed(() => {
    const data = this.mobilityData();
    if (!data) return 0;
    return Object.values(data.total_per_mean_of_transport).reduce(
      (sum, value) => sum + value,
      0,
    );
  });

  totalDistance = computed(() => {
    const data = this.mobilityData();
    if (!data) return 0;
    return Math.round(data.all_records.reduce((sum, r) => sum + r.distance, 0));
  });

  courseDistanceMap = computed(() => {
    const data = this.mobilityData();
    const map = new Map<string, number>();
    if (!data) return map;

    for (const record of data.all_records) {
      map.set(
        record.course_id,
        (map.get(record.course_id) ?? 0) + (record.distance ?? 0),
      );
    }
    return map;
  });

  sortedCourses = computed(() => {
    const data = this.mobilityData();
    if (!data) return [];
    return [...data.courses].sort((a, b) => {
      return a.course_id.localeCompare(b.course_id, 'de');
    });
  });

  allModes = computed(() => {
    const data = this.mobilityData();
    if (!data) return [];
    const allKnownModes = Object.keys(TRANSPORT_LABELS);

    const allReportedNodes = Object.entries(
      data.total_per_mean_of_transport,
    ).map(([mode]) => mode);

    const unknownModes = allReportedNodes
      .filter((mode) => !allKnownModes.includes(mode))
      .sort((a, b) => a.localeCompare(b, 'de'));

    return [...allKnownModes, ...unknownModes];
  });

  labelFor(mode: string): string {
    return labelFor(mode);
  }

  colorForMode(mode: string): string {
    return colorFor(mode);
  }

  courseCount(course: CourseMobilityStatisticsDTO, mode: string): number {
    return course.total_per_mean_of_transport[mode] ?? 0;
  }

  courseModeShare(course: CourseMobilityStatisticsDTO, mode: string): number {
    const total = this.courseModesTotal(course);
    if (!total) return 0;
    return (this.courseCount(course, mode) / total) * 100;
  }

  courseModesTotal(course: CourseMobilityStatisticsDTO): number {
    return this.allModes().reduce(
      (sum, mode) => sum + this.courseCount(course, mode),
      0,
    );
  }

  courseDistance(course: CourseMobilityStatisticsDTO): number {
    return this.courseDistanceMap().get(course.course_id) ?? 0;
  }

  downloadExcel(): void {
    const data = this.mobilityData();
    if (!data) return;

    const wb = XLSX.utils.book_new();
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '1E3A5F' } },
    };

    // Sheet 1: All individual records
    const ws1 = XLSX.utils.aoa_to_sheet([
      ['Kurs-ID', 'Verkehrsmittel', 'Distanz (km)'],
      ...data.all_records.map((r) => [
        r.course_id,
        labelFor(r.mean_of_transport),
        r.distance,
      ]),
    ]);
    ws1['!cols'] = [{ wch: 24 }, { wch: 22 }, { wch: 14 }];
    (['A1', 'B1', 'C1'] as const).forEach((addr) => {
      if (ws1[addr]) ws1[addr].s = headerStyle;
    });
    XLSX.utils.book_append_sheet(wb, ws1, 'Alle Fahrten');

    // Sheet 2: Per-course summary
    const modes = this.allModes();
    const ws2 = XLSX.utils.aoa_to_sheet([
      ['Kurs-ID', 'Kursname', 'Gesamt', ...modes.map(labelFor)],
      ...data.courses.map((c) => [
        c.course_id,
        c.course_name,
        Object.values(c.total_per_mean_of_transport).reduce(
          (sum, value) => sum + (value ?? 0),
          0,
        ),
        ...modes.map((m) => c.total_per_mean_of_transport[m] ?? 0),
      ]),
    ]);
    ws2['!cols'] = [
      { wch: 24 },
      { wch: 36 },
      { wch: 10 },
      ...modes.map(() => ({ wch: 16 })),
    ];
    for (let c = 0; c < 3 + modes.length; c++) {
      const addr = XLSX.utils.encode_cell({ r: 0, c });
      if (ws2[addr]) ws2[addr].s = headerStyle;
    }
    XLSX.utils.book_append_sheet(wb, ws2, 'Kurszusammenfassung');

    const binary = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    const blob = new Blob([binary], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Mobilitaetsstatistik.xlsx';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}
