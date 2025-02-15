import { Injectable } from '@angular/core';
import { sha256 } from 'crypto-hash';
import { LoginDetailService } from '../0.logindetail/logindetail.service';
import { ILoginDetail } from '../0.logindetail/logindetail.model';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private loginDetailService: LoginDetailService) {}

  async validateUser(username: string, password: string): Promise<boolean> {
    let userInfo = await lastValueFrom(this.loginDetailService.getByUser(username)); 
    
    //const passwordHash = await sha256(password);
    return (
      username === userInfo.name &&
      password === userInfo.password
    );
  }
}
