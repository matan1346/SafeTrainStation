import { Injectable } from '@angular/core';
import { PubNubAngular } from 'pubnub-angular2';
import { environment } from 'src/environments/environment';
import { StationsService } from './stations.service';

@Injectable({
  providedIn: 'root'
})
export class DetectionService {
  isListening = false;
  constructor(private pubnub: PubNubAngular, private stationsService: StationsService) {
    if(!this.isListening)
      this.pubnubInit();
    this.isListening = true;
   }


 async  pubnubInit() {

    await this.stationsService.initStations();

    this.pubnub.init({
      publishKey: environment.pubnubKeys.publishkey,
      subscribeKey: environment.pubnubKeys.subscribekey,
      ssl: true,
      uuid: "client"
    });



      this.pubnub.addListener({
        status: function (st) {

        },
        message: (message: any) => {
          console.log('got message: ');
          console.log(message);
          let alertData = message.message;
          if(alertData.type == '1'){
            this.stationsService.AddAlert(alertData.stationID, alertData.cameraID, alertData.alert);
          }
          else if(alertData.type == '2'){
            this.stationsService.UpdateS3UploadAlert(alertData.stationID, alertData.cameraID, alertData.fileID);
          }
        }
      });

      this.pubnub.subscribe({
      channels: [environment.pubnubKeys.channel],
      withPresence: true,
      triggerEvents: ['message', 'presence', 'status']
    });
  }

   async  publishCommand(messageText: string){
    await this.pubnub.publish({
      message: messageText,
      channel: environment.pubnubKeys.channel
    }).catch(error => {  // catch the errors
      console.log(error);
    });;
   }
}
