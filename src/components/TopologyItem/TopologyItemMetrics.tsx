import {Classes, Dialog} from "@blueprintjs/core";
import * as React from 'react';
import {ITopologyNode, ITreeItemSet} from "../../models/model";
import {EmptySummary} from "../UI/EmptySummary";
import {MetricTrend} from "../UI/MetricTrend";
import './../UI/UI.css';
import {TopologyConfiguration} from "./TopologyConfiguration";

enum Milliseconds {
    HOUR= 3600000,
    DAY= 24* 3600000,
    WEEK= 7 * 24 * 3600000,
}

interface ITopologyItemMetricsProps {
    node: ITopologyNode;
    metrics: any[];
}

interface ITopologyItemMetricsState {
    isDialogOpen: boolean;
    dialogMetric: any;
}

const MetricDialog = ({isOpen, onClose, onTimeChange, metric}: any) => {
  if (isOpen && metric !== null) {
      const currentTime = new Date().getTime();
      const optionsList: any[] = [
          {range: {startTime: currentTime - Milliseconds.HOUR, endTime: currentTime}, label: 'Last Hour'},
          {range: {startTime: currentTime - 3 * Milliseconds.HOUR, endTime: currentTime}, label: 'Last 3 Hours'},
          {range: {startTime: currentTime - 6 * Milliseconds.HOUR, endTime: currentTime}, label: 'Last 6 Hours'},
          {range: {startTime: currentTime - 12 * Milliseconds.HOUR, endTime: currentTime}, label: 'Last 12 Hours'},
          {range: {startTime: currentTime - 24 * Milliseconds.HOUR, endTime: currentTime}, label: 'Last 24 Hours'},
          {range: {startTime: currentTime - 3 * Milliseconds.DAY, endTime: currentTime}, label: 'Last 3 Days'},
          {range: {startTime: currentTime - Milliseconds.WEEK, endTime: currentTime}, label: 'Last 1 Week'},
          {range: {startTime: currentTime - 2 * Milliseconds.WEEK, endTime: currentTime}, label: 'Last 2 Weeks'},
      ];
      const optionElements: JSX.Element[] = optionsList.map(option => {
          const onTimeLineSelection = () => {
              return onTimeChange(option.range);
          };
          return (<li className="" key={option.label}>
              <a className="pt-menu-item pt-popover-dismiss pt-popover-dismiss-override"
                 onClick={onTimeLineSelection}>
                  <div className="pt-text-overflow-ellipsis pt-fill">{option.label}</div>
              </a>
          </li>);
      });

      return (
          <Dialog
              className="Dialog"
              isOpen={isOpen}
              icon="info-sign"
              onClose={onClose}
              title={metric.name}>
              <div className={Classes.DIALOG_BODY}>
                  <div className="CardContentContainer">
                      <div className="CardContent">
                          <ul className="pt-menu pt-daterangepicker-shortcuts">
                              {optionElements}
                          </ul>
                      </div>
                      <div className="CardContent">
                          <MetricTrend metric={metric} chartWidth={500}/>
                      </div>
                  </div>
              </div>
          </Dialog>
      );
  }
  return (<div/>);
};

export class TopologyItemMetrics extends React.Component<ITopologyItemMetricsProps, ITopologyItemMetricsState> {

    public state: ITopologyItemMetricsState;

    private treeConfigurations: ITreeItemSet = TopologyConfiguration.getConfiguration();

    constructor(props: ITopologyItemMetricsProps) {
        super(props);
        this.state = {
            dialogMetric: null,
            isDialogOpen: false,
        };
    }

    public render() {
        const nodeItem = this.props.node;
        const treeConfig = this.treeConfigurations[nodeItem.type];

        const onClick = async (metric: any) => {
            if (treeConfig.getSummaryData) {
                this.setState({isDialogOpen: true});
                this.setState({dialogMetric: metric});
            }
            return null;
        };

        const onTimeChange = async (range: any) => {
            if (range.hasOwnProperty('startTime') || range.hasOwnProperty('endTime')) {
                const response = await treeConfig.getSummaryData(nodeItem, {name: this.state.dialogMetric.name, ...range});
                const responseData = response[0].data;
                const metricData = responseData.length > 0 ? responseData[0] : {stats:[]};
                this.setState({dialogMetric: metricData});
            }
        };

        const metrics: JSX.Element[] = this.props.metrics.map((metric: any) => {
            return (<MetricTrend key={metric._id} metric={metric} onClick={onClick}/>);
        });

        if (metrics.length > 0) {
            return (<div className="CardContainer">
                {metrics}
                <MetricDialog isOpen={this.state.isDialogOpen}
                              onClose={this.handleDialogClose}
                              metric={this.state.dialogMetric}
                              onTimeChange={onTimeChange}/>
            </div>);
        }

        return (<EmptySummary/>);
    }

    private handleDialogClose = () => {
        this.setState({isDialogOpen: false});
        this.setState({dialogMetric: null});
    }
}
