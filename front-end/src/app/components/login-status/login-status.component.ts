import { Component, Inject } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js/lib/OktaAuth';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent {
  isAuthenticated: boolean = false;
  userFullName: string ='';
  constructor(private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktAuth: OktaAuth){}
  ngOnInit(): void  {
    //subscribe to  authentication state schange
    this.oktaAuthService.authState$.subscribe(
      (result)=> {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    )
  }
  getUserDetails() {
    if(this.isAuthenticated) {
      this.oktAuth.getUser().then(
        (res) => {
          this.userFullName = res.name as string;
        }
      )
    }
  }
  logout() {
    //terminates the  session with Okta and removes  current session
    this.oktAuth.signOut();

  }
}
