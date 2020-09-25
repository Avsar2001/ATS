
export class User {
    profileImage?: string;
    coverImage?: string;
    username: string;
    password: string;
    status: boolean;
    //Personal information
    personal: PersonalInfo;
    //Contact information
    contact: ContactInfo;
    //Academic Info
    academic?: AcademicInfo[];
    //Experience Info
    experience?: ExperienceInfo[];
    //skills
    skills?: string[];

}

export class PersonalInfo {
    firstName: string;
    lastName: string;
    enrollment: number;
    gender: number;
    bio?: string;
}

export class ContactInfo {
    email: string;
    phone: number;
    address1: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    postal: number;
}

export class AcademicInfo {
    collegeName: string;
    join: Date;
    compelete: Date;
    degree: string;
    branch: string;
    description: string;
    city: string;
    state: string;
    country: string;
}

export class ExperienceInfo {
    company: string;
    join: Date;
    out: Date;
    position: string;
    jobCity: string;
    jobState: string;
    jobCountry: string;
    jobInfo?: string;
    jobType: string;
}