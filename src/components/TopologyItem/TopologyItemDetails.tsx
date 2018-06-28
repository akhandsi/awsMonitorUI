import {Card} from "@blueprintjs/core";
import {AxiosResponse} from 'axios';
import * as React from 'react';
import {ITopologyNode, ITreeItemSet} from "../../models/model";
import {FilterTagList} from "../UI/FilterTagList";
import './../UI/UI.css';
import {TopologyConfiguration} from "./TopologyConfiguration";

interface ITreeItemProps {
    selectedNode?: ITopologyNode | undefined;
}

interface ITreeItemState extends ITreeItemProps {
    summary?: any[];
    selectedFilterTag?: string;
}

const TopologySummary = ({selectedFilterTag, selectedNode, summary, treeConfig}: any) => {
    const summaryCards = treeConfig.createNodeSummaryElement(selectedNode, summary, selectedFilterTag);
    return (<div>{summaryCards}</div>);
};

export class TopologyItemDetails extends React.Component<ITreeItemProps, ITreeItemState> {

    public static getDerivedStateFromProps(nextProps: ITreeItemProps, prevState: ITreeItemState) {
        if (nextProps.selectedNode !== prevState.selectedNode) {
            return {
                selectedNode: nextProps.selectedNode,
                selectedTag: 'all',
                summary: [],
            };
        }
        return null;
    }

    public state: ITreeItemState;

    private treeConfigurations: ITreeItemSet = TopologyConfiguration.getConfiguration();

    constructor(props: ITreeItemProps) {
        super(props);
        this.state = {
            selectedFilterTag: 'all',
            selectedNode: this.props.selectedNode,
            summary: [],
        }
    }

    public componentDidUpdate(prevProps: ITreeItemProps, prevState: ITreeItemState) {
        if (prevState.selectedNode !== this.state.selectedNode) {
            this.setState(this.state);
            this.getSummary()
                .then((responses: Array<AxiosResponse<any[]>>) => {
                    let flatResponse: any[] = [];

                    responses.forEach(response => {
                        flatResponse = flatResponse.concat(...response.data);
                    });

                    this.setState({summary: flatResponse});
                })
                .catch(e => this.setState({summary: []}));
        }
    }

    public render() {
        const selectedNode: ITopologyNode | undefined = this.state.selectedNode;
        if (selectedNode) {
            const treeConfig = this.treeConfigurations[selectedNode.type];
            return (
                <Card className="Container">
                    <h5>{selectedNode.type} - {selectedNode.label}</h5>
                    <FilterTagList tags={treeConfig.filterTags} onSelectTag={this.onSelectTag}/>
                    <TopologySummary selectedFilterTag={this.state.selectedFilterTag}
                                     selectedNode={selectedNode}
                                     summary={this.state.summary}
                                     treeConfig={treeConfig}/>
                </Card>
            );
        }

        return (
            <Card className="Container">
                <h5>Select item to see details</h5>
                <p>Here you'll find the details for the selected tree item</p>
            </Card>
        );
    }

    private onSelectTag = (selectedFilterTag: string) => {
        this.setState({selectedFilterTag});
    };

    private async getSummary(): Promise<Array<AxiosResponse<any[]>>> {

        if (!this.state.selectedNode) {
            return [];
        }

        const treeItem: ITopologyNode = this.treeConfigurations[this.state.selectedNode.type];

        if (!treeItem) {
            return [];
        }

        if (!treeItem.getSummaryData) {
            return [];
        }

        return await treeItem.getSummaryData(this.state.selectedNode, {});
    }
}
