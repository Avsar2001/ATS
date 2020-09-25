import { Time } from '@angular/common';

export class UserPost {
    public postPhoto?: string;
    public authorId: string;
    public createdDate: Date;
    public createdTime: Time;
    public like: string[];
    public comment?: Comment;
    public share: number;
    public content: string;
}

export class Comment {
    public comment: string;
    public authorId: string;
    public commentDate: Date;
    public commentTime: Time;
}

// export class Like {
//     public authorId: string;
// }