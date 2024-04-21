import { Injectable } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';

@Injectable({ providedIn: 'root' })
export class SelectConfig extends NgSelectConfig {
  override notFoundText = 'Keine Ergebnisse gefunden';
  override typeToSearchText = 'Tippen um zu suchen';
  override addTagText = 'Eintrag hinzufügen';
  override loadingText = 'Lade...';
  override clearAllText = 'Eingabe löschen';
}
