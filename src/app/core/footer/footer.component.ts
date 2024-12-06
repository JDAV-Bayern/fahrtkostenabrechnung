import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GithubIconComponent } from 'src/app/shared/icons/github-icon/github-icon.component';
import { InstagramIconComponent } from 'src/app/shared/icons/instagram-icon/instagram-icon.component';

@Component({
  selector: 'footer[appFooter]',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  imports: [RouterLink, InstagramIconComponent, GithubIconComponent]
})
export class FooterComponent {}
