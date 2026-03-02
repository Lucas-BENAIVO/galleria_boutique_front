
import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { StatsService, SalesByDay } from '../../../services/stats.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-ventes-par-jour',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ventes-par-jour.component.html',
  styleUrls: ['./ventes-par-jour.component.scss']
})
export class VentesParJourComponent implements OnInit, AfterViewInit {
  @ViewChild('lineChartCanvas') lineChartCanvas!: ElementRef<HTMLCanvasElement>;
  viewType: 'graph' | 'table' = 'graph';
  salesData: SalesByDay[] = [];
  isLoading = false;
  chartReady = false;
  selectedMonth = 'Mars';
  
  chart: Chart | null = null;

  onMonthChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedMonth = select.value;
    // Optionally reload data for selected month
  }

  constructor(
    private statsService: StatsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.chartReady = true;
    if (this.salesData.length > 0) {
      this.renderChart();
    }
  }

  loadData() {
    const boutiqueId = this.authService.getBoutiqueId();
    if (!boutiqueId) return;

    this.isLoading = true;
    this.statsService.getSalesByDay(boutiqueId).subscribe({
      next: (response) => {
        if (response.success) {
          this.salesData = response.data;
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

  get jours(): string[] {
    return this.salesData.map(d => d.jour);
  }

  get ventes(): number[] {
    return this.salesData.map(d => d.ventes);
  }

  renderChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.viewType === 'graph' && this.lineChartCanvas?.nativeElement) {
      this.chart = new Chart(this.lineChartCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: this.jours,
          datasets: [
            { label: 'Ventes', data: this.ventes, borderColor: '#13deb9', backgroundColor: 'rgba(19,222,185,0.2)', fill: true }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Ventes des 7 derniers jours' }
          }
        }
      });
    }
  }

  switchView(type: 'graph' | 'table') {
    this.viewType = type;
    setTimeout(() => this.renderChart(), 0);
  }

  refresh() {
    this.loadData();
  }
}
