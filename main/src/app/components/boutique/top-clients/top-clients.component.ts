
import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { StatsService, TopClient } from '../../../services/stats.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-top-clients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-clients.component.html',
  styleUrls: ['./top-clients.component.scss']
})
export class TopClientsComponent implements OnInit, AfterViewInit {
  @ViewChild('pieChartCanvas') pieChartCanvas!: ElementRef<HTMLCanvasElement>;
  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();
  viewType: 'graph' | 'table' = 'graph';
  clients: TopClient[] = [];
  isLoading = false;
  chartReady = false;
  
  chart: Chart | null = null;

  constructor(
    private statsService: StatsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.chartReady = true;
    if (this.clients.length > 0) {
      this.renderChart();
    }
  }

  loadData() {
    const boutiqueId = this.authService.getBoutiqueId();
    if (!boutiqueId) return;

    this.isLoading = true;
    this.statsService.getTopClients(boutiqueId, this.selectedMonth, this.selectedYear).subscribe({
      next: (response) => {
        if (response.success) {
          this.clients = response.data;
          if (this.chartReady) {
            this.renderChart();
          }
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  renderChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.viewType === 'graph' && this.pieChartCanvas?.nativeElement) {
      this.chart = new Chart(this.pieChartCanvas.nativeElement, {
        type: 'pie',
        data: {
          labels: this.clients.map(c => c.nom || c.email),
          datasets: [
            { data: this.clients.map(c => c.total), backgroundColor: ['#5d87ff', '#ffc107', '#13deb9', '#fa896b', '#8b5cf6'] }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Top clients' }
          }
        }
      });
    }
  }

  switchView(type: 'graph' | 'table') {
    this.viewType = type;
    setTimeout(() => this.renderChart(), 0);
  }

  onMonthChange(event: any) {
    this.selectedMonth = parseInt(event.target.value);
    this.loadData();
  }

  getMonthName(month: number): string {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return months[month - 1];
  }

  formatPrice(amount: number): string {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Ar';
  }
}
