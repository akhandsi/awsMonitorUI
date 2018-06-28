import {IconNames} from "@blueprintjs/icons";
import axios, {AxiosResponse} from 'axios';
import * as React from 'react';
import {IconSize, IconStyle, ITopologyNode, NodeClass} from "../../models/model";
import {TIconNameOrJSX, TStringOrNumber} from "../../typings/lang";
import {TooltipIcon} from "../UI/TooltipIcon";
import {Volume} from "./Volume";

export class HolderUnattachedVolumes implements ITopologyNode {

    public id: TStringOrNumber;
    public label: string;
    public countSummary: any;
    public type: any;

    constructor(){
        this.id = 2;
        this.label = 'Unattached Volumes';
        this.countSummary = {};
        this.type = NodeClass.HOLDER_UNATTACHED_VOLUMES;
    }

    public async getChildNodes(node: ITopologyNode): Promise<Array<AxiosResponse<any[]>>> {
        const zoneId: string = String(node.id).split('_')[0];
        return await Promise.all([axios.get(`/zone/${zoneId}/unattachedVolumes`)]);
    }

    public async getSummaryData(node: ITopologyNode, params: any): Promise<Array<AxiosResponse<any[]>>> {
        const zoneId: string = String(node.id).split('_')[0];
        return await Promise.all([axios.get(`/zone/${zoneId}/unattachedVolumes`)]);
    }

    public createNodeCountElement(node: ITopologyNode): JSX.Element {
        return (<TooltipIcon
            isEmpty={node.countSummary.numOfUnattachedVolumes === 0}
            identifier={`${node.id}_numOfUnattachedVolumes`}
            tooltipContent={`${node.countSummary.numOfUnattachedVolumes} Unattached Volumes`}
            text={node.countSummary.numOfUnattachedVolumes}
            icon={IconNames.DOCUMENT_OPEN}
            iconColor="blue"
            iconSize={IconSize}
            iconStyle={IconStyle}
        />);
    }

    public createNodeSummaryElement(node: ITopologyNode, data: any[], filterStr: string): JSX.Element {
        return (Volume.getCards(data));
    }

    public getIcon(node: ITopologyNode): TIconNameOrJSX {
        return IconNames.DOCUMENT_OPEN;
    }

    public isExpandable(node: ITopologyNode): boolean {
        return node.countSummary.numOfUnattachedVolumes > 0;
    }
}
