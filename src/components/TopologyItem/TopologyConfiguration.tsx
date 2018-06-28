import {ITreeItemSet} from "../../models/model";
import {DBInstance} from "../Configuration/DBInstance";
import {HolderDBInstances} from "../Configuration/HolderDBInstances";
import {HolderInstances} from "../Configuration/HolderInstances";
import {HolderUnattachedVolumes} from "../Configuration/HolderUnattachedVolumes";
import {Instance} from "../Configuration/Instance";
import {Region} from "../Configuration/Region";
import {Volume} from "../Configuration/Volume";
import {Zone} from "../Configuration/Zone";

export class TopologyConfiguration {

    /**
     * get an object to access each pre-defined tree item configuration
     * @return {ITreeItemSet}
     */
    public static getConfiguration(): ITreeItemSet {
        return {
            dbInstance: new DBInstance(),
            holderDBInstances: new HolderDBInstances(),
            holderInstances: new HolderInstances(),
            holderUnattachedVolumes: new HolderUnattachedVolumes(),
            instance: new Instance(),
            region: new Region(),
            volume: new Volume(),
            zone: new Zone(),
        };
    }
}
