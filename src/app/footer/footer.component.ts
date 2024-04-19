import { Component } from '@angular/core';
import { InstagramIconComponent } from '../icons/instagram-icon/instagram-icon.component';
import { GithubIconComponent } from '../icons/github-icon/github-icon.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: true,
  imports: [RouterLink, InstagramIconComponent, GithubIconComponent]
})
export class FooterComponent {}
