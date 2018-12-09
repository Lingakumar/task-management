import React, { Component } from 'react';
import TimeSheetViewer from '../../Components/templates/js/timesheet_view_table';
import TimeSheetStyle from '../css/timesheet_viewer.css';
let data = {
    "timesheetData" : [
        {
            "date" : "10/22/2018",
            "taskdetails" : [ 
                {
                    "projectId" : "RMT",
                    "subtaskDetailsArr": [ 
                        { 
                            "taskSubject" : "Coding",
                            "taskNotes":"coding & unit testing",
                            "taskTime":"4:00",
                            "totalTimeSpent":"4:00"
                        }
                    ]
                },
                {
                    "projectId":"Kraft",
                    "subtaskDetailsArr" : [
                        { 
                            "taskSubject" : "Bugfixing",
                            "taskNotes" : "bug fixing",
                            "taskTime" : "4:00",
                            "totalTimeSpent" : "4:00"
                        }
                    ]
                }
            ]
        }
    ]
}

const construct_timesheet_data = (data, rows, columns, default_value) => {

}

/* data must be an array and property is the attribute to which the key must be set */
const mapDatatoKey = (data, property) => {
    let key_map = new Map();
    if(Array.isArray(data) && data.length) {
        data.map(object => {
            if(object && object[property]) {
                let task_details = object.task_details || [];
                task_details.map(task => {
                    if(task && task.subtaskDetailsArr) {
                        let sub_task_arr = task.subtaskDetailsArr;
                        sub_task_arr.map(sub_task => {
                            
                        })
                    }
                })
                key_map.set(object[property], object);
            }
        })
    }
    return key_map;
}

class TimesheetView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table_json : {
                head : [],
                body : [
                    [
                        "Barnes and Noble",
                        "00h:00m",
                        "00h:00m",
                        "00h:00m",
                        "00h:00m",
                        "00h:00m",
                        "00h:00m",
                        "00h:00m",
                        "00h:00m"
                    ],
                    [
                        "kraft",
                        "00h:00m",
                        "00h:00m",
                        "00h:00m",
                        "00h:00m",
                        "00h:00m",
                        "00h:00m",
                        "00h:00m",
                        "00h:00m"
                    ],
                    [
                        "kraft",
                        "00h:00m",
                        "00h:00m",
                        "00h:00m",
                        "00h:00m",
                        "00h:00m",
                        "00h:00m",
                        "00h:00m",
                        "00h:00m"
                    ]
                ],
                footer : [
                    [
                        <button>SAVE</button>,
                        "00h:00m",
                        "00h:00m",
                        "00h:00m",
                        "00h:00m",
                        "00h:00m",
                        "00h:00m",
                        "00h:00m",
                        "00h:00m"
                    ]
                ]
            }
        }
    }
    componentDidMount() {
        let json_head = this.state.table_json && this.state.table_json.head ? [...this.state.table_json.head] : [];
        let date = new Date();
        let first = date.getDate() - date.getDay();
        let date_range_arr = []; 
        let head_data_arr = [
            <div>Project</div>
        ];
        for(let i = first; i < first + 7; i++) {
            let first_date = new Date(date.setDate(i + 1));
            let curr_date = first_date.toDateString();
            let curr_year = first_date.getFullYear().toString();
            let display_day = curr_date.replace(curr_year, "").split(" ");
            date_range_arr.push(first_date.toLocaleDateString());
            head_data_arr.push(<div>{display_day[0]} <br/> {display_day[1] + " " + display_day[2]}</div>);
        }
        head_data_arr.push(<div>Work Hours</div>);
        json_head.push(head_data_arr);
        this.setState({
            table_json: {head : json_head}
        })
    }
    render() {
        return (
            <div className = "table_container">
                <TimeSheetViewer prop = {this.state.table_json} />
            </div>
        )
    }
}

export default TimesheetView;