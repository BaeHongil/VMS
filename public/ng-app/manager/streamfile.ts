/**
 * Created by manager on 2016-08-17.
 */
export class StreamFile {
    name: string;
    uri: string;
    constructor(name?: string, uri?: string) {
        this.name = name || null;
        this.uri = uri || null;
    }
}

export class ConnectConfig{
    constructor(public appInstanceName: string, public mediaCasterType: string) { }
}