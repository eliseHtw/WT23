import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  backendUrl = 'http://localhost:4000'

  constructor(private http: HttpClient) { }

  // get all entries
  getAllUsers(): Observable<User[]> {
    let endpoint = '/usersh';
    return this.http.get<User[]>(this.backendUrl + endpoint);
  }

  // post one entrie
  registerUser(user: User): Observable<User> {
    let endpoint = '/usersh';
    return this.http.post<User>(this.backendUrl + endpoint, user);
  }

  // get one user via id
  getOneUserId(id: string): Observable<User>{
    let endpoint = '/usersh';
    return this.http.get<User>(this.backendUrl + endpoint + '/id/' + id);
  }

  // get one user via name
  getOneUserName(username: string): Observable<User>{
    let endpoint = '/usersh';
    return this.http.get<User>(this.backendUrl + endpoint + '/' + username);
  }

  // delete user
  deleteOneUser(id: string): Observable<any> {
    let endpoint = '/usersh';
    return this.http.delete<any>(this.backendUrl + endpoint + '/' + id);
  }

  // update user
  updateOneUser(user: User, id: string): Observable<User> {
    let endpoint = '/usersh';
    return this.http.put<User>(this.backendUrl + endpoint + '/' +id, user);
  }
}
