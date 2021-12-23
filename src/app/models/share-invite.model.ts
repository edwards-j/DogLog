export class ShareInvite {
    shareInviteID?: string;
    petID: string;
    petName: string;
    ownerEmail: string;
    shareWith: string;
    createdDateTime: number; // Unix Time
    seen: boolean;
}
