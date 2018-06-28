import {IconNames} from "@blueprintjs/icons";
import axios, {AxiosResponse} from 'axios';
import * as React from 'react';
import {IconSize, IconStyle, ITopologyNode, NodeClass} from "../../models/model";
import {TIconNameOrJSX, TStringOrNumber} from "../../typings/lang";
import {TooltipIcon} from "../UI/TooltipIcon";
import {DBInstance} from "./DBInstance";

export class HolderDBInstances implements ITopologyNode {

    public id: TStringOrNumber;
    public label: string;
    public countSummary: any;
    public type: any;

    constructor(){
        this.id = 1;
        this.label = 'DBInstances';
        this.countSummary = {};
        this.type = NodeClass.HOLDER_DB_INSTANCES;
    }

    public async getChildNodes(node: ITopologyNode): Promise<Array<AxiosResponse<any[]>>> {
        const zoneId: string = String(node.id).split('_')[0];
        return await Promise.all([axios.get(`/zone/${zoneId}/dbInstances`)]);
    }

    public async getSummaryData(node: ITopologyNode, params: any): Promise<Array<AxiosResponse<any[]>>> {
        const zoneId: string = String(node.id).split('_')[0];
        return await Promise.all([axios.get(`/zone/${zoneId}/dbInstances`)]);
    }

    public createNodeCountElement(node: ITopologyNode): JSX.Element {
        return ( <TooltipIcon
            isEmpty={node.countSummary.numOfDBInstances === 0}
            identifier={`${node.id}_numOfDBInstances`}
            tooltipContent={`${node.countSummary.numOfDBInstances} DB Instances`}
            text={node.countSummary.numOfDBInstances}
            icon={IconNames.DATABASE}
            iconColor="blue"
            iconSize={IconSize}
            iconStyle={IconStyle}
        />);
    }

    public createNodeSummaryElement(node: ITopologyNode, data: any[], filterStr: string): JSX.Element {
        return (DBInstance.getCards(data));
    }

    public getIcon(node: ITopologyNode): TIconNameOrJSX {
        return IconNames.DATABASE;
    }

    public isExpandable(node: ITopologyNode): boolean {
        return node.countSummary.numOfDBInstances > 0;
    }
}
