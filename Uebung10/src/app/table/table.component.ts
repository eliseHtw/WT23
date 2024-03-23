import { Component, OnInit, inject } from '@angular/core';
import { BackendService } from '../shared/backend.service';
import { User } from '../shared/user';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [ MatCardModule, MatGridListModule, MatTableModule ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {

  displayedColumns: string[] = [ 'id', 'username', 'email', 'password', 'role' ];
  dataSource: User[] = [];

  bs = inject(BackendService)
  // constructor(private bs: BackendService) {} // genau gleich wie das darüber
  usersh: User[] = [];

  constructor() {}

  ngOnInit(): void {
     this.readAllUsers();
  }

  readAllUsers() {
    this.bs.getAllUsers().subscribe({
      next: (response) => {
        console.log(response);
        this.dataSource = response;
        // console.log('usersh', this.usersh);
        // return this.usersh;
      },
      error: (err) => console.log('error', err),
      complete: () => console.log('getAllUsers completed')
    })
  }
}
