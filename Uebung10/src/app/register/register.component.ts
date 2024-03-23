import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BackendService } from '../shared/backend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  bs = inject(BackendService);
  router = inject(Router);

  usernameFC = new FormControl('', [Validators.required]);
  passwordFC = new FormControl('', [Validators.required, Validators.minLength(12)]);
  emailFC = new FormControl('', [Validators.required, Validators.email]);
  roleFC = new FormControl('', [Validators.required]);

  getErrorMessageUsername(){
    if(this.usernameFC.hasError('required')) return 'Bitte ausfüllen';
    else return '';
  }

  getErrorMessagePassword(){
    if(this.passwordFC.hasError('required')) return 'Bitte ausfüllen';
    else if(this.passwordFC.hasError('minlength')) return 'Mindestens 12 Zeichen';
    else return '';
  }

  getErrorMessageEmail(){
    if(this.emailFC.hasError('required')) return 'Bitte ausfüllen';
    else if(this.emailFC.hasError('email')) return 'Keine gültige E-Mail-Adresse';
    else return '';
  }

  getErrorMessageRole(){
    if(this.roleFC.hasError('required')) return 'Bitte ausfüllen';
    else return '';
  }

  formInvalid() {
    return this.usernameFC.invalid || this.passwordFC.invalid || this.emailFC.invalid || this.roleFC.invalid;
  }

  register() {
    if(!this.formInvalid()) {
      let user = {
        id: 0,
        username: this.usernameFC.value!,
        password: this.passwordFC.value!,
        email: this.emailFC.value!,
        role: this.roleFC.value!
      };

      this.bs.registerUser(user).subscribe({
        next: (response) =>  {
          console.log(response),
          this.router.navigate(['/table'])
        },
        error: (err) => console.log(err),
        complete: () => console.log('user created')
      })

      

      console.log('user', user);
    }
  }
}
