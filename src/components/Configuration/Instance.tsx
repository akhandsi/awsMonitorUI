import {Card, Classes, Elevation, Icon} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import axios, {AxiosResponse} from 'axios';
import * as React from 'react';
import {IconSize, IconStyle, ITopologyNode, NodeClass} from "../../models/model";
import {TIconNameOrJSX, TStringOrNumber} from "../../typings/lang";
import {TopologyItemMetrics} from "../TopologyItem/TopologyItemMetrics";
import {EmptySummary} from "../UI/EmptySummary";
import {TooltipIcon} from "../UI/TooltipIcon";
import './../UI/UI.css';

export class Instance implements ITopologyNode {

    public static getCards(instances: any[]): JSX.Element {
        const cardItems = instances.map ((instance: any) => {
            return (
                <Card key={instance._id} interactive={true} elevation={Elevation.TWO} className="Card">
                    <h5>{instance.name}</h5>
                    <div className="CardContentContainer">
                        <div className="CardContent">
                            <ul className={Classes.LIST_UNSTYLED}>
                                <li>InstanceType: {instance.instanceType}</li>
                                <li>Monitoring: {instance.monitoring}</li>
                                <li>Platform: {instance.platform}</li>
                                <li>Tenancy: {instance.tenancy}</li>
                                <li>EBSOptimized: {instance.ebsOptimized}</li>
                            </ul>
                        </div>
                        <div className="CardContent CardContentRight">
                            <Icon icon={IconNames.LAYER} iconSize={Icon.SIZE_LARGE}/>
                        </div>
                    </div>
                </Card>
            );
        });

        if (cardItems.length > 0) {
            const time = new Date().getTime();
            return (<div key={`instance_${time}`} className="CardContainer">{cardItems}</div>);
        }

        return (<EmptySummary/>);
    }

    public id: TStringOrNumber;
    public label: string;
    public countSummary: any;
    public type: any;

    constructor(){
        this.id = 3;
        this.countSummary = {};
        this.type = NodeClass.INSTANCE;
    }

    public async getChildNodes(node: ITopologyNode): Promise<Array<AxiosResponse<any[]>>> {
        return await Promise.all([axios.get(`/instance/${node.id}/volumes`)]);
    }

    public async getSummaryData(node: ITopologyNode, params: any): Promise<Array<AxiosResponse<any[]>>> {
        return await Promise.all([axios.post(`/instance/${node.id}/metrics`, {inputDTO: params})]);
    }

    public createNodeCountElement(node: ITopologyNode): JSX.Element {
        return (<TooltipIcon
            isEmpty={node.countSummary.numOfVolumes === 0}
            identifier={`${node.id}_numOfVolumes`}
            tooltipContent={`${node.countSummary.numOfVolumes} Volumes`}
            text={node.countSummary.numOfVolumes}
            icon={IconNames.DOCUMENT}
            iconColor="blue"
            iconSize={IconSize}
            iconStyle={IconStyle}
        />);
    }

    public createNodeSummaryElement(node: ITopologyNode, metrics: any[], filterStr: string): JSX.Element {
        return (<TopologyItemMetrics node={node} metrics={metrics}/>);
    }

    public getIcon(node: ITopologyNode): TIconNameOrJSX {
        return IconNames.LAYER;
    }

    public isExpandable(node: ITopologyNode): boolean {
        return node.countSummary.numOfVolumes > 0;
    }
}
