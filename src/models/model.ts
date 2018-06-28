import {ITreeNode} from "@blueprintjs/core";
import {
    TBiPromiseFunction,
    TFunction, TIconNameOrJSX, TPromiseFunction, TStringOrNumber,
    TStringOrUndefined, TTriFunction
} from "../typings/lang";

export const IconSize: number = 12;

export const IconStyle = {padding: '2px'};

export enum NodeClass {
    HOLDER_INSTANCES = 'holderInstances',
    HOLDER_DB_INSTANCES = 'holderDBInstances',
    HOLDER_UNATTACHED_VOLUMES = 'holderUnattachedVolumes',
    INSTANCE = 'instance',
    DB_INSTANCE = 'dbInstance',
    ZONE = 'zone',
    VOLUME = 'volume',
    REGION = 'region',
}

export interface INode {
    id: TStringOrNumber;
    label?: TStringOrUndefined;
}

export interface ITopologyNode extends ITreeNode<INode> {
    type: string;
    isExpandable: TFunction<ITopologyNode, boolean>;
    filterTags?: string[];
    nodeData?: any;
    childNodes?: ITopologyNode[];
    getIcon: TFunction<ITopologyNode, TIconNameOrJSX>;
    getChildNodes?: TPromiseFunction<ITopologyNode, any> | undefined;
    getSummaryData?: TBiPromiseFunction<ITopologyNode, any, any> | undefined;
    createNodeCountElement?: TFunction<ITopologyNode, JSX.Element>;
    createNodeSummaryElement?: TTriFunction<ITopologyNode, any[], string, JSX.Element>;
    countSummary: any;
}

export interface ITreeItemSet {
    dbInstance: ITopologyNode;
    holderDBInstances: ITopologyNode;
    holderInstances: ITopologyNode;
    holderUnattachedVolumes: ITopologyNode;
    instance: ITopologyNode;
    region: ITopologyNode;
    volume: ITopologyNode;
    zone: ITopologyNode;
}
