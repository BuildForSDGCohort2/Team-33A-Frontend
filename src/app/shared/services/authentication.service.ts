import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import * as firebase from "firebase";
import {AppUser} from "../interfaces/user.type";

const USER_AUTH_API_URL = "/api-url";

@Injectable()
export class AuthenticationService {
  public currentUser: Observable<AppUser>;
  private currentUserSubject: BehaviorSubject<AppUser>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<AppUser>(JSON.parse(localStorage.getItem("currentUser")));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): AppUser {
    return this.currentUserSubject.value;
  }

  /*loginWithCustomAuthService(username: string, password: string) {
    return this.http.post<any>(USER_AUTH_API_URL, {username, password})
      .pipe(map(user => {
        if (user && user.token) {
          localStorage.setItem("currentUser", JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }*/

  public loginWithEmailAndPassword(email: string, password: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }

  public logout() {
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
  }
}
