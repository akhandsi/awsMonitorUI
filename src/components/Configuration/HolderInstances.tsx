import {IconNames} from "@blueprintjs/icons";
import axios, {AxiosResponse} from 'axios';
import * as React from 'react';
import {IconSize, IconStyle, ITopologyNode, NodeClass} from "../../models/model";
import {TIconNameOrJSX, TStringOrNumber} from "../../typings/lang";
import {TooltipIcon} from "../UI/TooltipIcon";
import {Instance} from "./Instance";

export class HolderInstances implements ITopologyNode {

    public id: TStringOrNumber;
    public label: string;
    public countSummary: any;
    public type: any;

    constructor(){
        this.id = 1;
        this.label = 'Instances';
        this.countSummary = {};
        this.type = NodeClass.HOLDER_INSTANCES;
    }

    public async getChildNodes(node: ITopologyNode): Promise<Array<AxiosResponse<any[]>>> {
        const zoneId: string = String(node.id).split('_')[0];
        return await Promise.all([axios.get(`/zone/${zoneId}/instances`)]);
    }

    public async getSummaryData(node: ITopologyNode, params: any): Promise<Array<AxiosResponse<any[]>>> {
        const zoneId: string = String(node.id).split('_')[0];
        return await Promise.all([axios.get(`/zone/${zoneId}/instances`)]);
    }

    public getIcon(node: ITopologyNode): TIconNameOrJSX {
        return IconNames.LAYERS;
    }

    public createNodeCountElement(node: ITopologyNode): JSX.Element {
        return (<TooltipIcon
            isEmpty={node.countSummary.numOfInstances === 0}
            identifier={`${node.id}_numOfInstances`}
            tooltipContent={`${node.countSummary.numOfInstances} Volumes`}
            text={node.countSummary.numOfInstances}
            icon={IconNames.LAYERS}
            iconColor="blue"
            iconSize={IconSize}
            iconStyle={IconStyle}
        />);
    }

    public createNodeSummaryElement(node: ITopologyNode, data: any[], filterStr: string): JSX.Element {
        return (Instance.getCards(data));
    }

    public isExpandable(node: ITopologyNode): boolean {
        return node.countSummary.numOfInstances > 0;
    }
}
