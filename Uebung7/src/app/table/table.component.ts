import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../shared/members.service';
import { Member } from '../shared/member';
import { CommonModule, NgFor } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgFor],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {

  myservice = inject(MembersService);
  allMembers: Member[] = [];
  filterArray: Member[] = [];
  search = new FormControl('');

  async ngOnInit(): Promise<void> {
    this.allMembers = await this.myservice.getAllMembers();
    this.filterArray = this.allMembers;
    console.log('in table --> allMembers', this.allMembers)
  }

  filterMembers() {
    console.log(this.search.value)
    let searchString = this.search.value ? this.search.value : '';
    console.log('in table --> searchString', searchString);

    this.filterArray = this.allMembers.filter(   (member)  => {
      return (
        member.forename.toLowerCase().includes(searchString) ||
        member.surname.toLowerCase().includes(searchString)
      );
    });
  }
}
