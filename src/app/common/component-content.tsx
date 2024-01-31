'use client';
import React, { useEffect } from 'react';
import { Tooltip, TooltipComponent } from '@syncfusion/ej2-react-popups'
import { ListView } from '@syncfusion/ej2-react-lists';
import { TabComponent, TabItemModel } from '@syncfusion/ej2-react-navigations';
import { ToastComponent } from '@syncfusion/ej2-react-notifications';
import { GridComponent, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-grids';
import { Ajax, Browser, createElement, detach, select, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { useRouter, usePathname } from 'next/navigation';
import { category, apiList } from './content-config';
import Link from 'next/link';
import { setSelectList } from './leftpane';

let tabContentToolbar: Element;
let controlName: string;
let hash: string[];

/**
 * Prevent Tab Swipe Function
 */
function preventTabSwipe(e: any): void {
    if (e.isSwiped) {
        e.cancel = true;
    }
}

/**
 * Description Rendering
 */
function renderDescription(): void {
    let header: HTMLElement;
    let description: HTMLElement = select('#description', select('#control-content')) as HTMLElement;
    let descElement: HTMLElement = select('.description-section') as HTMLElement;
    let iDescription: Element = select('#description', descElement);
    if (iDescription) {
        detach(iDescription);
    }
    if (description) {
        descElement.appendChild(description);
    }
}



function renderActionDescription(): void {
    let aDescription: HTMLElement = select('#action-description', select('#control-content')) as HTMLElement;
    let aDescElem: HTMLElement = select('.sb-action-description') as HTMLElement;
    if (aDescription) {
        aDescElem.innerHTML = '';
        aDescElem.appendChild(aDescription);
        aDescElem.style.display = '';
    } else if (aDescElem) {
        aDescElem.style.display = 'none';
    }
}

export function renderDescriptions(): void {
    renderDescription();
    renderActionDescription();
}

declare global {
    interface Window {
        apiList: any;
    }
};

/**
* copy clipboard function
*/
function copyCode() {
    let copyElem = select('#sb-source-tab .e-item.e-active .sb-src-code');
    let textArea: HTMLTextAreaElement = createElement('textArea') as HTMLTextAreaElement;
    textArea.textContent = copyElem.textContent.trim();
    document.body.appendChild(textArea);
    (textArea as HTMLTextAreaElement).select();
    document.execCommand('copy');
    detach(textArea);
    select('.copy-tooltip').ej2_instances[0].close();
}




function Content({
    children, theme
}: {
    children: React.ReactNode, theme: string
}) {
    const router = useRouter();
    let pathName = usePathname();
    let [apiGridData, setApiGridData] = React.useState([]);
    let sourceTab!: TabComponent;
    let srcTab!: TabComponent;
    let [sourceTabItems, setSourceTabItems] = React.useState([]);
    let isMobile: boolean;
    //Regex for removing hidden
    const reg: RegExp = /.*custom code start([\S\s]*?)custom code end.*/g;

    function selectDefaultTab(): void {
        if (sourceTab) {
            sourceTab.selectedItem = 0;
        }
        if (srcTab) {
            srcTab.selectedItem = 0;
        }
    }

    useEffect(() => {
        selectDefaultTab();
    }, [theme]);

    useEffect(() => {
        selectDefaultTab();
        (window as Window).apiList = apiList;
        /**
         * Sample Control Name change
         */
        let sampleNameElement: Element;
        sampleNameElement = select('#component-name>.sb-sample-text');
        sampleNameElement.innerHTML = select('[control-name="' + pathName.split('/')[1] + '"]').getAttribute('name');

        // let controlElem = select('[control-name="' + hash[2].toLowerCase() + '"]');
        // controlName = controlElem ? controlElem.getAttribute('name') : toInitiaUpper(hash[2]);
        // sampleNameElement.innerHTML = controlName;

        /**
         * Bread Crumb
         */
        let catRegex = /(-| )/g;
        let controlName: string;
        let sampleName;
        let categoryName;
        let curObj: any = category[pathName.split('/')[1]][pathName.split('/')[2]];
        controlName = categoryName = toInitiaUpper(curObj.category);
        sampleName = curObj.name;
        let categoryFlag: boolean = new RegExp(categoryName.replace(catRegex, ''), 'i').test(controlName.replace(catRegex, ''));
        let breadCrumbComponent: Element = select('.sb-bread-crumb-text>.category-text') as Element;
        let breadCrumSeperator: HTMLElement = select('.category-seperator') as HTMLElement;
        let breadCrumbSubCategory: HTMLElement = select('.sb-bread-crumb-text>.component') as HTMLElement;
        let breadCrumbSample: Element = select('.sb-bread-crumb-text>.crumb-sample');
        breadCrumbComponent.innerHTML = controlName;
        if (!categoryFlag) {
            breadCrumbSubCategory.innerHTML = categoryName;
            breadCrumbSubCategory.style.display = '';
            breadCrumSeperator.style.display = '';
        } else {
            breadCrumbSubCategory.style.display = 'none';
            breadCrumSeperator.style.display = 'none';
        }
        breadCrumbSample.innerHTML = sampleName;

        // let title: HTMLElement = select('title') as HTMLElement;
        // title.innerHTML = controlName + ' · ' + sampleName + ' · Syncfusion React UI Components';
        //renderDescriptions();
        renderSourceTabContent();
        checkApiTableDataSource();
        setSelectList();
    }, [pathName]);



    function toInitiaUpper(str: string) {
        return str[0].toUpperCase() + str.slice(1).toLowerCase();
    }

    function checkApiTableDataSource() {
        if (!select('#content-tab').ej2_instances) {
            return;
        }
        let data = window.apiList[pathName.slice(1)] || [];
        if (!data.length) {
            select('#content-tab').ej2_instances[0].hideTab(2);
            setApiGridData([]);
        }
        else {
            select('#content-tab').ej2_instances[0].hideTab(2, false);
            setApiGridData(data);
        }
    }

    function viewMobilePropPane(): void {
        select('.sb-mobile-preference').classList.add('sb-hide');
        select('.sb-mobile-prop-pane').classList.remove('sb-hide');
        //toggleRightPane();
    }

    function onNextButtonClick(): void {
        hash = location.pathname.split('/');
        let currentIndex: number = (window as any).sampleOrder.indexOf(hash.slice(1).join('/'));
        let nextList: string = (window as any).sampleOrder[currentIndex + 1];
        if (currentIndex !== -1) {
            router.push(nextList.split('/')[1]);
            // sampleOverlay();
        }
    }
    function onPrevButtonClick(): void {
        hash = location.pathname.split('/');
        let currentIndex: number = (window as any).sampleOrder.indexOf(hash.slice(1).join('/'));
        let prevList: string = (window as any).sampleOrder[currentIndex - 1];
        console.log(prevList);
        if (currentIndex !== -1) {
            router.push(prevList.split('/')[1]);
            // sampleOverlay();
        }
    }

    function tabRendered(): void {
        let sampleNavigation: string = '<div class="sb-custom-item sample-navigation"><button id="prev-sample" class="sb-navigation-prev">' +
            '<span class="sb-icons sb-icon-Previous"></span></button><button  id="next-sample" class="sb-navigation-next">' +
            '<span class="sb-icons sb-icon-Next"></span></button></div>';
        let contentToolbarTemplate: string = sampleNavigation + '<div class="sb-icons sb-mobile-setting "></div>';

        tabContentToolbar = createElement('div', { className: 'sb-content-toolbar', innerHTML: contentToolbarTemplate });
        select('#sb-content-header').appendChild(tabContentToolbar);

        select('.sb-mobile-setting').addEventListener('click', viewMobilePropPane);

        /**
         * code for copyToolTip
         */

        let previous: Tooltip = new Tooltip({
            content: 'Previous Sample'
        });
        previous.appendTo('#prev-sample');

        let next: Tooltip = new Tooltip({
            content: 'Next Sample'
        });
        select('#right-pane').addEventListener('scroll', function () {
            next.close();
            previous.close();
        });
        next.appendTo('#next-sample');
        select('#next-sample').addEventListener('click', onNextButtonClick);
        select('#prev-sample').addEventListener('click', onPrevButtonClick);
        // select('.sb-mobile-setting').addEventListener('click', viewMobilePropPane);

        
        // processDeviceDependables();
        // setNavButtonState();
        //onComponentLoad();
        // intialLoadScrollTop();
        // removeOverlay();
        // checkApiTableDataSource();
    }

    function dynamicTab(e: any) {
        let blockEle: HTMLElement = select('#sb-source-tab > .e-content > #e-content-sb-source-tab_' + e.selectedIndex);
        let codeEle = blockEle.children[0];
        if (srcTab) {
            let sourceFile = srcTab.items[e.selectedIndex];
            codeEle.innerHTML = (sourceFile as any).data;
            codeEle.innerHTML = codeEle.innerHTML.replace(reg, '');
            highlightCode(codeEle, (sourceFile as any).properties.content.split('.')[1]);
            setTimeout(() => {
                let sbTabOverlay = select('.sb-tab-overlay');
                sbTabOverlay.classList.add('sb-hide');
            }, 300);
        }
    }

    function highlightCode(codeEle: any, fileType: any) {
        const types: { [key: string]: string } = {
            'tsx': 'text/typescript-jsx',
            'jsx': 'text/jsx',
            'css': 'text/css',
            'js': 'javascript',
            'json': 'application/json'
        };
        const parentEle = codeEle.parentNode;
        if (!parentEle.querySelector('.sb-src-code') && typeof window !== 'undefined') {
            const textELe = document.createElement('textarea');
            textELe.classList.add("sb-src-code");
            textELe.innerHTML = codeEle.innerHTML;
            parentEle.replaceChild(textELe, codeEle);
            (window as any).CodeMirror.fromTextArea(document.querySelector(`#${parentEle.id} .sb-src-code`), {
                mode: `${types[fileType]}`,
                readOnly: 'nocursor',
                theme: `${'default'}`
            });
        }
    }

    function onComponentLoad(): void {
        hash = pathName.split('/');
        // renderSourceTabContent();
        //renderSampleHeader();
        // selectDefaultTab();
        // if (select('.sb-desktop-setting'))
        //     processDeviceDependables();
        // let propPanel: Element = select('#control-content .property-section');
        // if (propPanel) {
        //     propPanel.classList.remove('sb-hide');
        //     if (propRegex.test(propPanel.className)) {
        //         propBorder.classList.add('sb-prop-md-3');
        //         propBorder.classList.remove('sb-prop-md-4');
        //     } else {
        //         propBorder.classList.add('sb-prop-md-4');
        //         propBorder.classList.remove('sb-prop-md-3');
        //     }
        //     propBorder.classList.remove('sb-hide');
        // } else {
        //     propBorder.classList.add('sb-hide');
        // }
        // let mobileSetting: Element = select('.sb-mobile-setting');
        // isMobile = window.matchMedia('(max-width:550px)').matches;
        // if (isMobile && mobileSetting) {
        //     if (propPanel) {
        //         propPanel.classList.add('sb-hide');
        //         mobileSetting.classList.remove('sb-hide');
        //         mobilePropPaneRoot.render(<PropertyPane title={PropertyPaneProps.title} children={PropertyPaneProps.children}/>);
        //     } else {
        //         select('.sb-mobile-setting').classList.add('sb-hide');
        //     }
        // }
    }

    function dynamicTabCreation(obj: any) {
        let blockEle = obj.element.querySelector('#e-content' + obj.tabId + '_' + obj.selectedItem).children[0];
        let sourceFile = obj.items[obj.selectedItem];
        blockEle.innerHTML = sourceFile.data;
        blockEle.innerHTML = blockEle.innerHTML.replace(reg, '');
        highlightCode(blockEle, sourceFile.properties.content.split('.')[1]);
    }

    function changeTab(args: any): void {
        if (args.selectedIndex === 1) {
            srcTab.items = sourceTabItems as any;
            srcTab.refresh();
            dynamicTabCreation(srcTab);
        }
        if (args.selectedItem && args.selectedItem.innerText === 'DEMO') {
            let demoSection = document.getElementsByClassName('sb-demo-section')[0];
            if (demoSection) {
                let elementList = demoSection.getElementsByClassName('e-control e-lib');
                for (let i = 0; i < elementList.length; i++) {
                    let instance = (elementList[i] as any).ej2_instances;
                    if (instance && instance[0] && typeof instance[0].refresh === 'function') {
                        instance[0].refresh();
                    }
                    if (instance && instance[0] && instance[0].getModuleName() !== 'DashboardLayout')
                        break;
                }
            }
        }
    }



    function sourceFileList(node: any) {
        for (let samples of node.curViewDS) {
            if (samples.path == pathName.slice(1)) {
                return samples.sourceFiles;
            }
        }
    }

    function generatePath(path: string): { path: string, displayName: string }[] {
        let splitPath = path.split('/')[2];
        let tsx = [{ path: `/src${path}/page.tsx`, displayName: `${splitPath}.tsx` }];
        return tsx;
    }

    function getStringWithOutDescription(code: any, descRegex: any) {
        var lines = code.split('\n');
        var desStartLine = null;
        var desEndLine = null;
        var desInsideDivCnt = 0;
        for (var i = 0; i < lines.length; i++) {
            var curLine = lines[i];
            if (desStartLine) {
                if (/<div/g.test(curLine)) {
                    desInsideDivCnt = desInsideDivCnt + 1;
                }
                if (desInsideDivCnt && /<\/div>/g.test(curLine)) {
                    desInsideDivCnt = desInsideDivCnt - 1;
                }
                else if (!desEndLine && /<\/div>/g.test(curLine)) {
                    desEndLine = i + 1;
                }
            }
            if (descRegex.test(curLine)) {
                desStartLine = i;
            }
        }
        if (desEndLine && desStartLine) {
            lines.splice(desStartLine, desEndLine - desStartLine);
        }
        return lines.join('\n');
    }


    function renderSourceTabContent() {
        let sourcePromise = [];
        let sObj: object[] = [];
        let sampleListFile = select('#controlList').ej2_instances[0];
        let sourceFiles = sourceFileList(sampleListFile) || generatePath(pathName);
        for (let sourceFile of sourceFiles) {
            sourcePromise.push((new Ajax(sourceFile.path, 'GET', false)).send());
            sObj.push({
                header: { text: sourceFile.displayName },
                data: '',
                content: sourceFile.displayName
            });
        }
        Promise.all(sourcePromise).then((results) => {
            results.forEach((value, index) => {
                let sampleContent = value.toString();
                sampleContent = getStringWithOutDescription(sampleContent, /(\'|\")action-description/g);
                sampleContent = getStringWithOutDescription(sampleContent, /(\'|\")description/g);
                sampleContent = sampleContent.replace(/&/g, '&amp;')
                    .replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                (sObj[index] as any).data = sampleContent;
            });
            setSourceTabItems(sObj as never[]);
        });
        // if (Browser.isDevice) {
        //     if (window.sampleOrder.indexOf(location.hash.split('/').slice(2).join('/')) == -1) {
        //         let toastObj = new ToastComponent({
        //             position: {
        //                 X: 'Right'
        //             }
        //         });
        //         let hideLocation = location.hash.split('/')[2];
        //         toastObj.appendTo('#sb-home');
        //         setTimeout(() => {
        //             toastObj.show({
        //                 content: `${hideLocation} component not supported in mobile device`
        //             });
        //         }, 200);
        //         location.hash = "#/material/grid/overview";
        //     }
        // }
    }

    function template(props: any) {
        return (
            <Link href={props.link} target="_blank">{props.name}</Link>
        )
    }

    function templateDescription(props: any) {
        return (
            <div className='sb-sample-description'>
                <div className='sb-api-content' dangerouslySetInnerHTML={{ __html: SanitizeHtmlHelper.sanitize(props.description) }}></div>
            </div>
        )
    }




    return (
        <TabComponent id='content-tab' className='sb-content-tab' selecting={preventTabSwipe} selected={changeTab} ref={t => (sourceTab as any) = t} created={tabRendered}>
            <div id="sb-content" className='sb-content-section'>
                <div id='sb-content-header' className="e-tab-header sb-content-tab-header">
                    <div>
                        <span className="sb-icons sb-icon-Demo"></span> <span className="sb-tab-title"> DEMO </span></div>
                    <div>
                        <span className="sb-icons sb-icon-Code"></span><span className="sb-tab-title"> SOURCE </span></div>
                    <div>
                        <span className="sb-icons sb-icon-API"></span><span className="sb-tab-title"> API </span>
                    </div>
                </div>

                <div className="e-content sb-sample-content-area">
                    <div>
                        <div className='sb-demo-section'>
                            <div className="control-fluid">
                                <div className="container-fluid">
                                    <div id="control-content">{children}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='sb-source-section'>
                            <div className="sb-tab-overlay sb-hide">
                                <div className="sb-loading">
                                    <svg className="circular" height="40" width="40">
                                        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="6" strokeMiterlimit="10" />
                                    </svg>
                                </div>
                            </div>
                            <TabComponent id='sb-source-tab' className="sb-source-code-section" headerPlacement='Top' selected={dynamicTab}
                                ref={t => srcTab = (t as TabComponent)}
                                selecting={preventTabSwipe}>
                            </TabComponent>
                            <TooltipComponent className="copy-tooltip" content='Copied to clipboard' position='BottomCenter' opensOn='Click' onClick={copyCode} closeDelay={500}>
                                <div className="e-icons copycode"></div>
                            </TooltipComponent>
                        </div>
                    </div>
                    <div>
                        <GridComponent id='api-grid' dataSource={apiGridData}>
                            <ColumnsDirective>
                                <ColumnDirective field='name' headerText='name' template={template} width='180' textAlign='Center'></ColumnDirective>
                                <ColumnDirective field='type' headerText='Type' width='180' ></ColumnDirective>
                                <ColumnDirective field='description' headerText='Description' template={templateDescription} width='200' />
                            </ColumnsDirective>
                        </GridComponent>
                    </div>

                </div>
            </div>
        </TabComponent>
    )
}

export default Content