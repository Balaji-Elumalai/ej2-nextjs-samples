'use client';
import * as React from 'react';
import { Animation, Browser, extend, select } from '@syncfusion/ej2-base';
import { ListViewComponent, ListView, SelectEventArgs } from '@syncfusion/ej2-react-lists';
import { TreeViewComponent } from '@syncfusion/ej2-react-navigations';
import { DataManager, Query, DataUtil } from '@syncfusion/ej2-data';
import { samplesList } from './sample-list';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

let sampleOrder: string[] = [];
let controlSampleData: any = {};

export interface MyWindow extends Window {
    sampleOrder: string[];
    apiList: any;
}

declare let window: MyWindow;

function viewSwitch(from: HTMLElement, to: HTMLElement, reverse?: boolean): void {
    let anim: Animation = new Animation({ duration: 500, timingFunction: 'ease' });
    let controlSamples: HTMLElement = select('#controlSamples') as HTMLElement;
    controlSamples.classList.add('control-samples-animate');
    from.style.overflowY = 'hidden';
    to.style.overflowY = 'hidden';
    to.classList.remove('sb-hide');
    anim.animate(from, {
        name: reverse ? 'SlideRightOut' : 'SlideLeftOut', end: (): void => {
            controlSamples.classList.remove('control-samples-animate');
            from.style.overflowY = '';
            to.style.overflowY = '';
            from.classList.add('sb-hide');

        }
    });
    anim.animate(to, { name: reverse ? 'SlideLeftIn' : 'SlideRightIn' });
}

function showHideControlTree(): void {
    let controlTree: HTMLElement = select('#controlTree') as HTMLElement;
    let controlList: HTMLElement = select('#controlSamples') as HTMLElement;
    let reverse: boolean = controlTree.classList.contains('sb-hide');
    reverse ? viewSwitch(controlList, controlTree, reverse) : viewSwitch(controlTree, controlList, reverse);
}

export function setSelectList(): void {
    let hash: string[] = location.pathname.split('/');
    let list: ListView = (select('#controlList') as any).ej2_instances[0];
    let control: Element = select('[control-name="' + hash[1] + '"]') || select('[control-name="grid"]');
    if (control) {
        let data: any = list.dataSource;
        let samples: any = controlSampleData[control.getAttribute('control-name') as any];
        if (JSON.stringify(data) !== JSON.stringify(samples)) {
            list.dataSource = samples;
        }
        let selectSample: Element = select('[data-path="' + '/' + hash.slice(1).join('/') + '"]', select('#controlList'));
        if (selectSample) {
            if (!select('#controlTree').classList.contains('sb-hide')) {
                showHideControlTree();
            }
            list.selectItem(selectSample);
            selectSample.scrollIntoView({ block: "nearest" });
        }
    } else {
        if (select('#controlList').classList.contains('sb-hide')) {
            showHideControlTree();
        }
        list.selectItem(select('[data-path="/grid/overview"]'));
    }
}

interface LeftPaneState {
    sampleOrder: string[]; // Make sure the state type matches the interface
}


export default function LeftPaneFunc(this: any) {

    const router = useRouter();

    let samplesTreeList: any = getTreeviewList(getDataSource());
    /**
     * TreeView Configuration
     */
    let treeFields: Object = { dataSource: samplesTreeList, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild', htmlAttributes: 'url', sortOrder: 'order' }
    /**
     * ListView Configuration
     */
    let fields: Object = { id: 'id', text: 'name', groupBy: 'order', htmlAttributes: 'data' };
    let nodeTemplate: string = '<div><span class="tree-text">${name}</span>' +
    '${if(type === "update")}<span class="e-badge sb-badge e-samplestatus ${type} tree tree-badge">Updated</span>' +
    '${else}${if(type)}<span class="e-badge sb-badge e-samplestatus ${type} tree tree-badge">${type}</span>${/if}${/if}</div>';
    let groupTemlate: string = '${if(items[0]["category"])}<div class="e-text-content">' +
    '<span class="e-list-text">${items[0].category}</span></div>${/if}';
    let template: string = '<div class="e-text-content ${if(type)}e-icon-wrapper${/if}"> <span class="e-list-text" role="listitem">${name}' +
    '</span>${if(type === "update")}<span class="e-badge sb-badge e-samplestatus ${type}">Updated</span>' +
    '${else}${if(type)}<span class="e-badge sb-badge e-samplestatus ${type}">${type}</span>${/if}${/if}' +
    '${if(directory)}<div class="e-icons e-icon-collapsible"></div>${/if}</div>';
    /**
     * Listview Control
     */
    let listControl!: ListViewComponent;
    /**
     * TreeView Control
     */
    let treeControl!: TreeViewComponent;

    let isMobile: boolean;
let isTablet: boolean;
let isPc: boolean;
let locationPath: any

if (typeof window !== 'undefined') {    
    locationPath = window.location;
}



    // componentDidMount(): void {
    //     this.setState({ sampleOrder: window.sampleOrder });
    //     //this.location = location;
        
    // }
    //let  locationPath;

    useEffect(() => {

        select('#sb-left-back').addEventListener('click', showHideControlTree);
      }, []);


    function getDataSource(): { [key: string]: Object; }[] {
        if (Browser.isDevice) {
            let tempData: any = extend([], samplesList);
            let tempLists: any = [];
            for (let temp of tempData) {
                if(temp.hideOnDevice == true)
                {
                    continue;
                }
                let data: DataManager = new DataManager(temp.samples);
                temp.samples = data.executeLocal(new Query().where('hideOnDevice', 'notEqual', true));
                tempLists = tempLists.concat(temp);
            }
            return tempLists;
        }
        return samplesList;
    }
    /**
     * TreeView Data Source Function
     */
    function getTreeviewList(list: any[]): { [key: string]: Object }[] {
        let id: number = 1;
        let pid: number;
        let tempList: any[] = [];
        let category: string = '';
        let categories: Object[] = [];
        let order: any = {};
        categories = DataUtil.distinct(list, 'category');
        for (let j: number = 0; j < categories.length; j++) {
            tempList = tempList.concat({ id: id, name: categories[j], order: j, hasChild: true, expanded: true });
            pid = id;
            for (let k: number = 0; k < list.length; k++) {
                if (list[k].category === categories[j]) {
                    id += 1;
                    tempList = tempList.concat(
                        {
                            id: id,
                            pid: pid,
                            name: list[k].name,
                            type: list[k].type,
                            url: {
                                'data-path': '/' + list[k].samples[0].path,
                                'control-name': list[k].path,
                                'name': list[k].name
                            }
                        });
                    controlSampleData[list[k].path] = getSamples(list[k].samples);
                    controlSampleData = controlSampleData;
                }
            }
        }
        if (typeof window !== 'undefined') {
            window.sampleOrder = sampleOrder;
        }
        return tempList;
    }
    /**
     * ListView Data Source Function
     */
    function getSamples(samples: any): any {
        let tempSamples: any = [];
        for (let i: number = 0; i < samples.length; i++) {
            tempSamples[i] = samples[i];
            tempSamples[i].data = { 'sample-name': samples[i].name, 'data-path': '/' + samples[i].path };
            tempSamples[i].id = i.toString();
            sampleOrder.push(samples[i].path);
        }
        return tempSamples;
    }

    function controlListRefresh(ele: Element): void {
        let samples: any = controlSampleData[ele.getAttribute('control-name') as any];
        if (samples) {
            let listView: any = (select('#controlList') as any).ej2_instances[0];
            listView.dataSource = samples;
            showHideControlTree();
        }
    }

    function controlSelect(arg: any): void {
        //selectDefaultTab();
        let path: string = (arg.node || arg.item).getAttribute('data-path');
        let curHashCollection: string = '/' + location.hash.split('/').slice(2).join('/');
        if (path) {
            controlListRefresh(arg.node || arg.item);
            if (path !== curHashCollection) {
                isMobile = window.matchMedia('(max-width:550px)').matches;
                isTablet = window.matchMedia('(min-width:600px) and (max-width: 850px)').matches;
                isPc = window.matchMedia('(min-width:850px)').matches;
                //sampleOverlay();
                let theme: string = location.hash.split('/')[1] || 'material';
                // if (arg.item && ((isMobile && !select('#left-sidebar').classList.contains('sb-hide')) ||
                //     ((isTablet || (Browser.isDevice && isPc)) && isLeftPaneOpen()))) {
                //     toggleLeftPane();
                // }
                router.push(path);
                // setTimeout(() => {
                //     location.hash = '#/' + theme + path;
                //     //initialize();
                //  }, 600);
            }
        }
    }

    return (
        <>
            <div className='sb-control-navigation'>
                <TreeViewComponent id='controlTree' cssClass="sb-hide" nodeClicked={controlSelect.bind(this as any)}
                    className='e-view'
                    fields={treeFields}
                    nodeTemplate={nodeTemplate}
                    ref={t => (treeControl as any) = t}
                />
                <div id="controlSamples" className="e-view">
                    <div id="sb-left-back" className="back">
                        <div className="sb-icons sb-icon-Back"></div>
                        <div className='control-name'>All Controls</div>
                    </div>
                    <ListViewComponent id='controlList' select={controlSelect}
                        actionComplete={setSelectList}
                        className='e-view sb-control-list-top'
                        fields={fields}
                        dataSource={
                            controlSampleData[locationPath ? locationPath.hash.split('/')[2] : ''] ||
                            controlSampleData.grid}
                        groupTemplate={groupTemlate}
                        template={template}
                        ref={l => (listControl as any) = l}
                    />
                </div>
            </div>
        </>
    )
}
