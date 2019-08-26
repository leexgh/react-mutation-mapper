import _ from "lodash";
import {observer} from "mobx-react";
import * as React from "react";

import {ColumnSelector, ColumnSelectorProps, ColumnVisibilityDef} from "../ColumnSelector";
import {SearchBox} from "./SearchBox";

type DataTableToolbarProps = {
    showColumnVisibility?: boolean;
    visibilityToggle?: (selectedColumnIds: string[]) => void;
    columnVisibility?: ColumnVisibilityDef[];
    columnSelectorProps?: ColumnSelectorProps;
    showSearchBox?: boolean;
    onSearch?: (searchText: string) => void;
    filterInputRef?: (input: HTMLInputElement) => void;
    searchDelay?: number;
    searchPlaceHolder?: string;
}

@observer
export class DataTableToolbar extends React.Component<DataTableToolbarProps, {}>
{
    public static defaultProps: Partial<DataTableToolbarProps> = {
        showColumnVisibility: true,
        showSearchBox: true,
        searchDelay: 400
    };

    public render()
    {
        return (
            <div
                className="dataTableMainToolbar"
                style={{paddingBottom: "0.4rem", display: "flex"}}
            >
                {this.props.showColumnVisibility && (
                    <div
                        className="small"
                        style={{width: 150, marginLeft: "auto"}}
                    >
                        <ColumnSelector
                            columnVisibility={this.props.columnVisibility}
                            onColumnToggled={this.props.visibilityToggle}
                            {...this.props.columnSelectorProps}
                        />
                    </div>
                )}
                {this.props.showSearchBox && (
                    <div
                        className="small"
                        style={{width: 200, marginLeft: 5}}
                    >
                        <SearchBox
                            placeholder={this.props.searchPlaceHolder}
                            onChange={
                                this.props.onSearch ?
                                    _.debounce(this.props.onSearch, this.props.searchDelay) : this.props.onSearch
                            }
                            filterInputRef={this.props.filterInputRef}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default DataTableToolbar;
