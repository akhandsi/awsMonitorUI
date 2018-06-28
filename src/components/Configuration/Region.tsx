import {IconNames} from "@blueprintjs/icons";
import axios, {AxiosResponse} from 'axios';
import * as React from 'react';
import {IconSize, IconStyle, ITopologyNode, NodeClass} from "../../models/model";
import {TIconNameOrJSX, TStringOrNumber} from "../../typings/lang";
import {TooltipIcon} from "../UI/TooltipIcon";
import {DBInstance} from "./DBInstance";
import {Instance} from "./Instance";
import {Volume} from "./Volume";

export class Region implements ITopologyNode {

    public id: TStringOrNumber;
    public label: string;
    public countSummary: any;
    public filterTags: string[];
    public type: any;

    constructor() {
        this.id = 5;
        this.countSummary = {};
        this.filterTags = ['all', 'instance', 'dbInstance', 'volume'];
        this.type = NodeClass.REGION;
    }

    public async getChildNodes(node: ITopologyNode): Promise<Array<AxiosResponse<any[]>>> {
        return await Promise.all([axios.get(`/region/${node.id}/zones`)]);
    }

    public async getSummaryData(node: ITopologyNode, params: any): Promise<Array<AxiosResponse<any[]>>> {
        return await Promise.all([
            axios.get(`/region/${node.id}/instances`),
            axios.get(`/region/${node.id}/dbInstances`),
            axios.get(`/region/${node.id}/unattachedVolumes`),
        ]);
    }

    public createNodeCountElement(node: ITopologyNode): JSX.Element {
        return (<div>
            <TooltipIcon
                isEmpty={node.countSummary.numOfInstances === 0}
                identifier={`${node.id}_numOfInstances`}
                tooltipContent={`${node.countSummary.numOfInstances} Instances`}
                text={node.countSummary.numOfInstances}
                icon={IconNames.LAYERS}
                iconColor="blue"
                iconSize={IconSize}
                iconStyle={IconStyle}
            />
            <TooltipIcon
                isEmpty={node.countSummary.numOfDBInstances === 0}
                identifier={`${node.id}_numOfDBInstances`}
                tooltipContent={`${node.countSummary.numOfDBInstances} DB Instances`}
                text={node.countSummary.numOfDBInstances}
                icon={IconNames.DATABASE}
                iconColor="blue"
                iconSize={IconSize}
                iconStyle={IconStyle}
            />
            <TooltipIcon
                isEmpty={node.countSummary.numOfUnattachedVolumes === 0}
                identifier={`${node.id}_numOfUnattachedVolumes`}
                tooltipContent={`${node.countSummary.numOfUnattachedVolumes} Unattached Volumes`}
                text={node.countSummary.numOfUnattachedVolumes}
                icon={IconNames.DOCUMENT_OPEN}
                iconColor="red"
                iconSize={IconSize}
                iconStyle={IconStyle}
            />
        </div>);
    }

    public createNodeSummaryElement(node: ITopologyNode, data: any[], filterStr: string): JSX.Element {
        const instanceData = data.filter(item => item.type === 'instance');
        const dbInstanceData = data.filter(item => item.type === 'dbInstance');
        const volumeData = data.filter(item => item.type === 'volume');
        let cards: JSX.Element[] = [];

        if (filterStr === 'all') {
            if (instanceData.length > 0) {
                cards = cards.concat(Instance.getCards(instanceData));
            }
            if (dbInstanceData.length > 0) {
                cards = cards.concat(DBInstance.getCards(dbInstanceData));
            }
            if (volumeData.length > 0) {
                cards = cards.concat(Volume.getCards(volumeData));
            }
        } else if (filterStr === 'dbInstance') {
            if (dbInstanceData.length > 0) {
                cards = cards.concat(DBInstance.getCards(dbInstanceData));
            }
        } else if (filterStr === 'instance') {
            if (instanceData.length > 0) {
                cards = cards.concat(Instance.getCards(instanceData));
            }
        } else if (filterStr === 'volume') {
            if (volumeData.length > 0) {
                cards = cards.concat(Volume.getCards(volumeData));
            }
        }
        return (<div>{cards}</div>);
    }

    public getIcon(node: ITopologyNode): TIconNameOrJSX {
        return IconNames.CLOUD;
    }

    public isExpandable(node: ITopologyNode): boolean {
        return node.countSummary.numOfInstances > 0 ||
            node.countSummary.numOfDBInstances > 0 ||
            node.countSummary.numOfUnattachedVolumes > 0;
    }
}
