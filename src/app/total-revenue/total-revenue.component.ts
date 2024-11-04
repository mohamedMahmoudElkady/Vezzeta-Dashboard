import { CommonModule } from '@angular/common';
import { Component, OnInit,NgZone } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { BubbleDataPoint, ChartConfiguration, ChartData, ChartType, Point } from 'chart.js';
import { BaseChartDirective} from 'ng2-charts';

@Component({
  selector: 'app-total-revenue',
  standalone: true,
  imports: [BaseChartDirective, FormsModule, CommonModule,],
  templateUrl: './total-revenue.component.html',
  styleUrls: ['./total-revenue.component.css'],
})
export class TotalRevenueComponent implements OnInit {
  totalRevenue: number = 0;
  totalDoctors: number = 0;

  // Chart configuration
  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public chartLabels: string[] = ['$600','$3000', '$6000', '$9000'];
  public chartType: ChartType = 'bar';
  public chartData: ChartData<'bar', (number | [number, number] | Point | BubbleDataPoint | null)[], string> = {
    datasets: [
      { data: [], label: 'Revenue Milestones' },
    ],
    labels: this.chartLabels,
  };

  constructor(private firestore: Firestore,private zone: NgZone) {}

  async ngOnInit() {
    const doctorCollection = collection(this.firestore, 'doctor');

    try {
      // Get all doctors
      const allDocsSnapshot = await getDocs(doctorCollection);
      this.totalDoctors = allDocsSnapshot.size;

      // Count doctors with verification field set to true
      const verifiedDocs = allDocsSnapshot.docs.filter(
        (doc) => doc.data()['verification'] === 'true'
      );
      const verifiedCount = verifiedDocs.length;

      this.totalRevenue = verifiedCount * 600;

      // Update chart data
      this.zone.run(() => {
        this.chartData.datasets[0].data = [600,3000, 6000, 9000].map((milestone) =>
          this.totalRevenue >= milestone ? milestone : 0
        );
      });
      setTimeout(() => {
        this.chartData = { ...this.chartData }; // Force change detection
      });

    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  }
}
