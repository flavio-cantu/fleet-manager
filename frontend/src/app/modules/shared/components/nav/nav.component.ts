import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { MobileService } from '../../../../services/mobile.service';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  link?: string;
  badge?: string;
  badgeClass?: string;
  children?: MenuItem[];
  expanded?: boolean;
  active?: boolean;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  collapsed = true;
  hover = false;
  currentRoute = '';

  menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'bi bi-trash3-fill',
      link: '/client',
      badge: 'New',
      badgeClass: 'bg-success',
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: 'bi bi-trash3-fill',
      children: [
        {
          id: 'sales-report',
          label: 'Vendas',
          icon: 'bi bi-trash3-fill',
          link: '/client',
        },
        {
          id: 'inventory-report',
          label: 'Estoque',
          icon: 'bi bi-trash3-fill',
          link: '/client',
        },
        {
          id: 'financial-report',
          label: 'Financeiro',
          icon: 'bi bi-trash3-fill',
          link: '/rclient',
        },
      ],
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Monitorar mudanças de rota
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.updateActiveItems();
    });

    this.updateActiveItems();
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
  }

  onMouseEnter(): void {
    this.hover = true;
  }

  onMouseLeave(): void {
    this.hover = false;
  }

  toggleSubMenu(menuItem: MenuItem): void {
    if (menuItem.children) {
      menuItem.expanded = !menuItem.expanded;
    }
  }

  navigate(link?: string): void {
    if (link) {
      this.router.navigate([link]);
    }
  }

  isLinkActive(link?: string): boolean {
    if (!link) return false;
    return this.router.isActive(link, {
      paths: 'subset',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  updateActiveItems(): void {
    this.currentRoute = this.router.url;

    const updateItemActiveState = (items: MenuItem[]): boolean => {
      let hasActiveChild = false;

      items.forEach((item) => {
        // Verifica se o item atual está ativo
        if (item.link && this.isLinkActive(item.link)) {
          item.active = true;
          hasActiveChild = true;
        } else {
          item.active = false;
        }

        // Verifica recursivamente nos filhos
        if (item.children) {
          const childActive = updateItemActiveState(item.children);
          if (childActive) {
            item.active = true;
            item.expanded = true;
            hasActiveChild = true;
          }
        }
      });

      return hasActiveChild;
    };

    updateItemActiveState(this.menuItems);
  }

  getSidebarWidth(): string {
    if (this.hover) {
      return '250px';
    }
    return this.collapsed ? '60px' : '250px';
  }

  getSidebarClasses(): string {
    const classes = ['sidebar'];

    if (this.collapsed) {
      classes.push('collapsed');
    }

    if (this.hover) {
      classes.push('expanded');
    }

    return classes.join(' ');
  }
}
