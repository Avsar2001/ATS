import { Time } from '@angular/common';

export class Event {
    public id?: string;
    public eventPhoto?: string;
    public t: string;
    public createdDate: Date;
    public eventDate: Date;
    public eventTime: Time;
    public description: string;
    public host: string;
    public city: string;
    public duration: number;
    public location?: Location;
    public attende: string[];

    public createdById: string;
    public verificationStatus: boolean;
}