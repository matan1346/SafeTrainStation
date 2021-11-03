import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Station } from '../models/station.model';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Camera } from '../models/camera.model';
import { Alert } from '../models/alert.model';

@Injectable({
  providedIn: 'root'
})
export class StationsService {

  private stationsData$ = new BehaviorSubject<Station[]>([]);
  private firstTimeLoaded = false;
  constructor(private httpClient: HttpClient) {

    this.loadStations();
   }

   async initStations(){
    if(!this.firstTimeLoaded){
      this.firstTimeLoaded = true;
      await this.loadStations();
    }
  }

    randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  getStations() : Observable<Station[]>{
    return this.stationsData$.asObservable();
  }

  async loadStations(): Promise<void>{
    try{
      let stations = await this.httpClient.get<Station[]>(`${environment.serverURL}get_all_stations_details`).toPromise();
      console.log(stations);
      console.log('loaded data');
      this.stationsData$.next(stations);
    }catch(e){
      console.log('error load stations - ' + e);
    }
  }

  getStationByID(id: string) : Station{
    let stations =  this.stationsData$.value;
    let index = stations.findIndex(x => x.id == id);
    if(index >= 0){
      return stations[index];
    }
    return null;
  }

  AddAlert(stationID: string, cameraID: string, alert: Alert){
    let stations = this.stationsData$.value;
    let index = stations.findIndex(x => x.id == stationID);
    if(index >= 0){
      let cameraIndex = stations[index].cameras.findIndex(x => x.id == cameraID);
      if(cameraIndex >= 0){
        if(stations[index].cameras[cameraIndex].alerts.filter(x => x.id == alert.id).length == 0){
          stations[index].cameras[cameraIndex].alerts.unshift(alert);
          this.stationsData$.next(stations);
        }


      }
    }
  }

  RemoveAlert(stationID: string, cameraID: string, alertID: string){
    let stations = this.stationsData$.value;
    let index = stations.findIndex(x => x.id == stationID);
    if(index >= 0){
      let cameraIndex = stations[index].cameras.findIndex(x => x.id == cameraID);
      if(cameraIndex >= 0){
        let alertIndex = stations[index].cameras[cameraIndex].alerts.findIndex(x => x.id == alertID);
        if(alertIndex >= 0){
          stations[index].cameras[cameraIndex].alerts.splice(alertIndex, 1);
          this.stationsData$.next(stations);
        }
      }
    }
  }

  UpdateAlert(stationID: string, cameraID: string, alert: Alert){
    let stations = this.stationsData$.value;
    let index = stations.findIndex(x => x.id == stationID);
    if(index >= 0){
      let cameraIndex = stations[index].cameras.findIndex(x => x.id == cameraID);
      if(cameraIndex >= 0){
        let alertIndex = stations[index].cameras[cameraIndex].alerts.findIndex(x => x.id == alert.id);
        if(alertIndex >= 0){
          stations[index].cameras[cameraIndex].alerts[alertIndex] = alert;
          this.stationsData$.next(stations);
        }
      }
    }
  }


  UpdateS3UploadAlert(stationID: string, cameraID: string, fileID: string){
    let stations = this.stationsData$.value;
    let index = stations.findIndex(x => x.id == stationID);
    if(index >= 0){
      let cameraIndex = stations[index].cameras.findIndex(x => x.id == cameraID);
      if(cameraIndex >= 0){
        let alertIndex =  stations[index].cameras[cameraIndex].alerts.findIndex(x => x.fileID == fileID);
        if(alertIndex >= 0){
          stations[index].cameras[cameraIndex].alerts[alertIndex].s3Upload = true;
          this.stationsData$.next(stations);
        }
      }
    }
  }





}
