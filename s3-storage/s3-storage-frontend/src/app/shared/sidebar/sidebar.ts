import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter } from 'rxjs/operators';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar implements OnInit {
  isExpanded = true;
  activeRoute = '';

  menuItems: MenuItem[] = [
    {
      icon: 'folder',
      label: 'My Buckets',
      route: '/buckets'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Track active route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activeRoute = event.url;
      });

    // Set initial active route
    this.activeRoute = this.router.url;
  }

  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
  }

  isActive(route: string): boolean {
    return this.activeRoute.startsWith(route);
  }
}