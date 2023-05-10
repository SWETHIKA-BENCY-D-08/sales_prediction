import { HttpClient } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private file!: File;
  private periodicity!: string;
  private periods!: string;
  csvData: string[][]=[]

  constructor(private auth:AuthService, private http:HttpClient, private router: Router){

  }

  ngOnInit(): void{
    this.auth.canAccess();
  }
    
      
  onFileSelected(event:any):void {
    
    this.file = event.target.files[0];
  }
  
  onPeriodicityChange(event: any): void {
    this.periodicity = event.target.value;
  }

  onPeriodsChange(event: any): void {
    this.periods = event.target.value;
  }
  onSubmit(): void{
    const formData = new FormData();
    formData.append('csvFile', this.file);
    formData.append('periodicity', this.periodicity);
    formData.append('periods',this.periods)

    this.http.post('http://127.0.0.1:5000/', formData, { responseType: 'text' }).subscribe(
      (response) => {
        console.log('File uploaded successfully');
        let lines =response.split('\n');
        let r2=lines.slice(0,1).join('\n');
        let first=lines.slice(1,5).join('\n');
        console.log(first)
        this.csvData=this.parseCSV(response)
        this.router.navigate(['/prediction'],{state:{chartData: this.csvData,Metrics: first,R2: r2}});
      },
      (error) => {
        console.error('File upload failed',error.message);
      }
    );
  }
  private parseCSV(csv: string): string[][] {
    const rows: string[] = csv.split('\r\n');
    const data: string[][] = [];
    console.log(rows)
    rows.forEach(row => {
      data.push(row.split(','));
    });
    return data;
  }

}