import autobind from "autobind-decorator";
import * as React from "react";
import {action, computed} from "mobx";
import {observer} from "mobx-react";

import {CheckedSelect, Option} from "cbioportal-frontend-commons";


export type TrackVisibility = {[trackName: string]: 'visible' | 'hidden'};
export type TrackDataStatus = {[trackName: string]: 'pending' | 'error' | 'complete' | 'empty'}

export enum TrackName {
    PDB = "PDB",
    CancerHotspots = "CANCER_HOTSPOTS",
    OncoKB = "ONCO_KB",
    PTM = "PTM"
}

interface ITrackSelectorProps {
    trackVisibility: TrackVisibility;
    trackDataStatus?: TrackDataStatus;
    onChange: (selectedTrackIds: string[]) => void;
    name?: string;
    placeholder?: string;
}

@observer
export default class TrackSelector extends React.Component<ITrackSelectorProps, {}>
{

    public static defaultProps:Partial<ITrackSelectorProps> = {
        name: "mutationMapperTrackSelector",
        placeholder: "Add annotation tracks"
    };

    @autobind
    @action
    private onChange(values: {value: string}[]) {
        this.props.onChange(values.map(o => o.value));
    }

    @computed get selectedValues() {
        return Object.keys(this.props.trackVisibility)
            .filter(id => this.props.trackVisibility[id] === 'visible')
            .map(id => ({value: id}));
    }

    @computed get options(): Option[] {
        return [
            {
                label: (
                    <span>
                        Cancer Hotspots
                        {this.isPending(TrackName.CancerHotspots) && this.loaderIcon()}
                    </span>
                ),
                value: TrackName.CancerHotspots
            },
            {
                label: (
                    <span>
                        OncoKB
                        {this.isPending(TrackName.OncoKB) && this.loaderIcon()}
                    </span>
                ),
                value: TrackName.OncoKB
            },
            {
                label: (
                    <span>
                        Post Translational Modifications
                        {this.isPending(TrackName.PTM) && this.loaderIcon()}
                    </span>
                ),
                value: TrackName.PTM
            },
            {
                label: (
                    <span>
                        3D Structure
                        {this.isPending(TrackName.PDB) && this.loaderIcon()}
                    </span>
                ),
                value: TrackName.PDB,
                disabled: this.isDisabled(TrackName.PDB)
            }
        ];
    }

    private isPending(trackName: string) {
        return this.props.trackDataStatus && this.props.trackDataStatus[trackName] === 'pending';
    }

    private isDisabled(trackName: string) {
        return this.props.trackDataStatus && this.props.trackDataStatus[trackName] !== 'complete';
    }

    private loaderIcon()
    {
        return (
            <span
                style={{
                    display: "inline-block",
                    verticalAlign: "bottom",
                    marginLeft: 5,
                }}
            >
                <i className="fa fa-spinner fa-pulse" />
            </span>
        );
    }

    public render()
    {
        return (
            <CheckedSelect
                name={this.props.name}
                placeholder={this.props.placeholder}
                onChange={this.onChange}
                options={this.options}
                value={this.selectedValues}
            />
        );
    }
}
