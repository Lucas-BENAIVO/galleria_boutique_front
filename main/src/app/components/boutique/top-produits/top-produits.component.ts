
import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { StatsService, TopProduct } from '../../../services/stats.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-top-produits',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-produits.component.html',
  styleUrls: ['./top-produits.component.scss']
})
export class TopProduitsComponent implements OnInit, AfterViewInit {
  @ViewChild('barChartCanvas') barChartCanvas!: ElementRef<HTMLCanvasElement>;
  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();
  viewType: 'graph' | 'table' = 'graph';
  produits: TopProduct[] = [];
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
    if (this.produits.length > 0) {
      this.renderChart();
    }
  }

  loadData() {
    const boutiqueId = this.authService.getBoutiqueId();
    if (!boutiqueId) return;

    this.isLoading = true;
    this.statsService.getTopProducts(boutiqueId, this.selectedMonth, this.selectedYear).subscribe({
      next: (response) => {
        if (response.success) {
          this.produits = response.data;
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
    if (this.viewType === 'graph' && this.barChartCanvas?.nativeElement) {
      this.chart = new Chart(this.barChartCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: this.produits.map(p => p.nom),
          datasets: [
            { label: 'Ventes', data: this.produits.map(p => p.ventes), backgroundColor: '#5d87ff' }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Top produits' }
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
}
