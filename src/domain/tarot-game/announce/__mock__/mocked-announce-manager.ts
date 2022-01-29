import {AnnounceManager} from "../announce-manager";

export class MockedAnnounceManager implements AnnounceManager{
    announce = jest.fn();
    announcesAreComplete = jest.fn()
    beginAnnounces = jest.fn()
}
