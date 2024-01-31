'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link'
import LeftPaneFunc from './common/leftpane';
import Content from './common/component-content';
import { Browser, select, detach, closest, Animation } from '@syncfusion/ej2-base';
import { SidebarComponent, EventArgs } from '@syncfusion/ej2-react-navigations';
import { usePathname } from 'next/navigation';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { Popup } from '@syncfusion/ej2-react-popups';
import { DropDownList, DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { DataManager } from '@syncfusion/ej2-data';

/**
 * SB Popups.
 */
let switcherPopup: Popup;
let themeSwitherPopup: Popup;
let searchPopup: Popup;
let settingsPopup: Popup;
let searchInstance: any;
let settingElement: HTMLElement;

let headerThemeSwitch: HTMLElement;
let prevAction: string;
let themeDropDown: DropDownList;
let cultureDropDown: DropDownList;
let currencyDropDown: DropDownList;


/**
 * default theme on sample loaded
 */
export let selectedTheme: string;
const themeCollection: string[] = ['fluent', 'fluent-dark', 'bootstrap5', 'bootstrap5-dark', 'tailwind', 'tailwind-dark', 'material', 'material-dark', 'material3', 'material3-dark', 'fabric', 'fabric-dark', 'bootstrap4', 'bootstrap', 'bootstrap-dark', 'highcontrast'];
let themeList: HTMLElement;

/**
 * constant for search operations
 */
let searchEle: any;
let inputele: any;
let searchOverlay: Element;
let searchButton: Element;
export let setResponsiveElement: Element;

if (typeof document != 'undefined') {
  settingElement = select('.sb-setting-btn') as HTMLElement
  headerThemeSwitch = document.getElementById('header-theme-switcher') as HTMLElement
  //location.hash.split('/')[1] || 
  selectedTheme = localStorage.getItem('ej2-theme') || 'material3';
  localStorage.removeItem('ej2-theme');
  themeList = document.getElementById('themelist') as HTMLElement;
  searchEle = select('#search-popup');
  inputele = select('#search-input');
  searchOverlay = select('.e-search-overlay');
  searchButton = document.getElementById('sb-trigger-search') as Element;
  setResponsiveElement = select('.setting-responsive');
}


/**
 * constant to process the sample url
 */
const urlRegex: RegExp = /(npmci\.syncfusion\.com|ej2\.syncfusion\.com)(\/)(development|production)*/;
const sampleRegex: RegExp = /#\/(([^\/]+\/)+[^\/\.]+)/;
const sbArray: string[] = ['angular', 'typescript', 'javascript', 'aspnetcore', 'aspnetmvc', 'vue', 'blazor'];
const sbObj: { [index: string]: string } = { 'angular': 'angular', 'typescript': '', 'javascript': 'javascript', 'vue': 'vue', 'blazor': 'blazor' };

/**
 * SB Switch Link Updation
 */
export function setSbLink(): void {
  let hrefLink: string[] = location.pathname.split('/').slice(1);
  let href: string = location.href = '#/' + selectedTheme + '/' + hrefLink.slice(1).join('/');
  let link: string[] = href.match(urlRegex);
  let sample: string[] = href.match(sampleRegex);
  for (let sb of sbArray) {
    let ele: HTMLFormElement = (select('#' + sb) as HTMLFormElement);
    if (sb === 'aspnetcore' || sb === 'aspnetmvc') {
      ele.href = sb === 'aspnetcore' ? 'https://ej2.syncfusion.com/aspnetcore/' : 'https://ej2.syncfusion.com/aspnetmvc/';

    } else if (sb === 'blazor') {
      ele.href = 'https://blazor.syncfusion.com/demos/';
    } else {
      ele.href = ((link) ? ('http://' + link[1] + '/' + (link[3] ? (link[3] + '/') : '')) :
        ('https://ej2.syncfusion.com/')) + (sbObj[sb] ? (sb + '/') : '') +
        'demos/#/' + (sample ? (sample[1] + (sb !== 'typescript' ? '' : '.html')) : '');
    }
  }
}

export default function Home({ children, theme, setTheme
}: {
  children: React.ReactNode, theme: string, setTheme: Function
}) {

  let routeName: string = usePathname();
  let isRenderDescription: boolean = true;
  let themeSwitherPopup: Popup;
  /**
   * Toggle Pane Animation
   */
  // let toggleAnim: Animation = new Animation({ duration: 500, timingFunction: 'ease' });
  let leftToggle: Element;
  let sbRightPane: HTMLElement;
  let sbContentOverlay: HTMLElement;
  let sbBodyOverlay: HTMLElement;
  let sbHeader: HTMLElement;
  let sidebar!: SidebarComponent;
  // let leftPane: HTMLElement = select('.sb-left-pane') as HTMLElement;

  let description = useRef(null);
  let actionDescription = useRef(null);

  let openedPopup: any = useRef(null);



  // let [theme, setTheme] = useState('material3')


  function removeOverlay(): void {
    sbRightPane = select('.sb-right-pane') as HTMLElement;
    sbContentOverlay = select('.sb-content-overlay') as HTMLElement;
    sbHeader = select('#sample-header') as HTMLElement;
    sbBodyOverlay = select('.sb-body-overlay') as HTMLElement;
    sbContentOverlay.classList.add('sb-hide');
    sbRightPane.classList.remove('sb-right-pane-overlay');
    sbHeader.classList.remove('sb-right-pane-overlay');
    // mobNavOverlay(false);
    if (!sbBodyOverlay.classList.contains('sb-hide')) {
      sbBodyOverlay.classList.add('sb-hide');
    }
    // isMobile = window.matchMedia('(max-width:550px)').matches;
    // if (!isMobile) {
    //   sbRightPane.scrollTop = 0;
    // }
    // if (cultureDropDown.value == 'ar') {
    //   changeRtl(true);
    // }
  }

  function sampleOverlay(): void {
    sbRightPane = select('.sb-right-pane') as HTMLElement;
    sbContentOverlay = select('.sb-content-overlay') as HTMLElement;
    sbHeader = select('#sample-header') as HTMLElement;

    sbHeader.classList.add('sb-right-pane-overlay');
    sbRightPane.classList.add('sb-right-pane-overlay');
    //mobNavOverlay(true);
    sbContentOverlay.classList.add('sb-hide');
  }

  /**
 * Render Sample Browser Popups
 */
  function renderSbPopups(): void {
    switcherPopup = new Popup(document.getElementById('sb-switcher-popup') as HTMLElement, {
      relateTo: select('.sb-header-text-right') as HTMLElement, position: { X: 'left' },
      collision: { X: 'flip', Y: 'flip' },
      offsetX: 0,
      offsetY: -15,
    });
    themeSwitherPopup = new Popup(document.getElementById('theme-switcher-popup') as HTMLElement, {
      offsetY: 2,
      zIndex: 10012,
      relateTo: select('.theme-wrapper') as HTMLElement, position: { X: 'left', Y: 'bottom' },
      collision: { X: 'flip', Y: 'flip' }
    });
    themeSwitherPopup.hide();
    searchPopup = new Popup(searchEle, {
      offsetY: 5,
      relateTo: inputele, position: { X: 'left', Y: 'bottom' }
      , collision: { X: 'flip', Y: 'flip' }
    });
    settingsPopup = new Popup(document.getElementById('settings-popup') as HTMLElement, {
      offsetY: 5,
      zIndex: 10012,
      relateTo: settingElement as HTMLElement,
      position: { X: 'right', Y: 'bottom' },
      collision: { X: 'flip', Y: 'flip' }
    });
    // settingsidebar = new Sidebar({
    //   position: 'Right', width: '282', zIndex: '1003', showBackdrop: true, type: 'Over',
    //   closeOnDocumentClick: true, close: closeRightSidebar
    // });
    // settingsidebar.appendTo('#right-sidebar');
    if (!isMobile) {
      // settingsidebar.hide();
      settingsPopup.hide();
    } else {
      select('.sb-mobile-preference').appendChild(select('#settings-popup'));
    }
    searchPopup.hide();
    switcherPopup.hide();
    // themeDropDown = new DropDownList({
    //   index: 0,
    //   change: (e: any) => { switchTheme(e.value); }
    // });
    // cultureDropDown = new DropDownList({
    //   index: 0,
    //   change: (e: any) => {
    //     let value: string = e.value;
    //     currencyDropDown.value = matchedCurrency[value];
    //     setCulture(e.value);
    //     if (value == 'ar') {
    //       changeRtl(true);
    //     } else {
    //       changeRtl(false);
    //     }
    //   }
    // });
    // currencyDropDown = new DropDownList({
    //   index: 0,
    //   change: (e: any) => { setCurrencyCode(e.value); }
    // });
    // cultureDropDown.appendTo('#sb-setting-culture');
    // currencyDropDown.appendTo('#sb-setting-currency');
    // themeDropDown.appendTo('#sb-setting-theme');
  }

  useEffect(() => {
    renderSbPopups();
    bindEvents();
  }, []);

  /**
 * toggle search overlay
 */
  function toggleSearchOverlay(): void {
    sbHeaderClick('closePopup', true);
    inputele.value = '';
    searchPopup.hide();
    searchButton.classList.toggle('active');
    searchOverlay.classList.toggle('sb-hide');
    if (!searchOverlay.classList.contains('sb-hide')) {
      inputele.focus();
    }
  }

  function bindEvents(): void {
    (document.getElementById('sb-switcher') as HTMLElement).addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      sbHeaderClick('changeSampleBrowser');
    });
    select('.sb-header-text-right').addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      sbHeaderClick('changeSampleBrowser');
    });
    headerThemeSwitch.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      sbHeaderClick('changeTheme');
    });
    themeList.addEventListener('click', changeTheme);
    document.addEventListener('click', () => sbHeaderClick('closePopup'));
    settingElement.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      sbHeaderClick('toggleSettings');
    });
    (searchButton as HTMLElement).addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSearchOverlay();
    });
    (document.getElementById('settings-popup') as HTMLElement).addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    });
    inputele.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    });
    inputele.addEventListener('keyup', onsearchInputChange);
    // setResponsiveElement.addEventListener('click', setMouseOrTouch);
    // leftToggle.addEventListener('click', toggleLeftPane);
    // mobileOverlay.addEventListener('click', toggleMobileOverlay);
    // select('.sb-header-settings').addEventListener('click', viewMobilePrefPane);
    // resetSearch.addEventListener('click', resetInput);

    (document.getElementById('switch-sb') as HTMLElement).addEventListener('click', (e: MouseEvent) => {
      let target: Element = closest(e.target as any, 'li');
      if (target) {
        let anchor: any = target.querySelector('a');
        if (anchor) {
          anchor.click();
        }
      }
    });
  }

  /**
 * search input change
 */
  function onsearchInputChange(e: KeyboardEvent): void {
    if (e.keyCode === 27) {
      toggleSearchOverlay();
    }
    let searchString: string = (e.target as any).value;
    // changeInputIcons(searchString.length > 0);
    if (searchString.length <= 2) {
      searchPopup.hide();
      return;
    }
    let val: any = [];
    val = searchInstance.search(searchString, {
      fields: {
        component: { boost: 1 },
        name: { boost: 2 }
      },
      expand: true,
      boolean: 'AND',
    });
    let value: any = [];
    if (Browser.isDevice) {
      for (let file of val) {
        if (file.doc.hideOnDevice !== true) {
          value = value.concat(file);
        }
      }
    }
    let searchValue = Browser.isDevice ? value : val;
    // if (searchValue.length) {
    //   let data: DataManager = new DataManager(searchValue);
    //   let controls: any = data.executeLocal(new Query().take(10).select('doc'));
    //   let controlsAccess: any = [];
    //   for (let cont of controls) {
    //     controlsAccess.push(cont.doc);
    //   }
    //   let ds: any = DataUtil.group(controlsAccess, 'component');
    //   let dataSource: { [key: string]: Object }[] & Object[] = [];
    //   for (let j: number = 0; j < ds.length; j++) {
    //     let itemObj: any = ds[j].items;
    //     let field: string = 'name';
    //     let grpItem: { [key: string]: Object } = {};
    //     let hdr: string = 'isHeader';
    //     grpItem[field] = ds[j].key;
    //     grpItem[hdr] = true;
    //     grpItem.items = itemObj;
    //     dataSource.push(grpItem);
    //     for (let k: number = 0; k < itemObj.length; k++) {
    //       dataSource.push(itemObj[k]);
    //     }
    //   }
    //   let ele: any = ListBase.createList(createElement, dataSource, {
    //     fields: { id: 'uid', groupBy: 'component', text: 'name' },
    //     template: '<div class="e-text-content e-icon-wrapper" data="${path}" uid="${uid}">' +
    //       '<span class="e-list-text" role="list-item">' +
    //       '${name}</span></div>',
    //     groupTemplate:
    //       '${if(items[0]["component"])}<div class="e-text-content"><span class="e-search-group">${items[0].component}</span>' +
    //       '</div>${/if}'
    //   });
    //   searchPopup.element.innerHTML = '';
    //   highlight(searchString, ele);
    //   searchPopup.element.appendChild(ele);
    //   searchPopup.show();
    // } else {
    //   searchPopup.element.innerHTML = '<div class="search-no-record">We’re sorry. We cannot find any matches for your search term.</div>';
    //   searchPopup.show();
    // }
  }


  /**
 * Header Click Event Handling
 */
  function sbHeaderClick(action: string, preventSearch?: boolean): void {
    if (openedPopup.current && !openedPopup.current.element.classList.contains('e-popup-close')) {
      openedPopup.current.hide(new Animation({ name: 'FadeOut', duration: 300, delay: 0 }));
    }
    if (preventSearch !== true && !searchOverlay.classList.contains('sb-hide')) {
      searchOverlay.classList.add('sb-hide');
      searchButton.classList.remove('active');
    }
    let curPopup!: Popup;
    switch (action) {
      case 'changeSampleBrowser':
        curPopup = switcherPopup;
        break;
      case 'changeTheme':
        headerThemeSwitch.classList.toggle('active');
        curPopup = themeSwitherPopup;
        break;
      case 'toggleSettings':
        settingElement.classList.toggle('active');
        //themeDropDown.index = themeCollection.indexOf(selectedTheme);
        curPopup = settingsPopup;
        break;
    }
    if (action === 'closePopup') {
      headerThemeSwitch.classList.remove('active');
      settingElement.classList.remove('active');
    }
    if (curPopup) {
      curPopup.show(new Animation({ name: 'FadeIn', duration: 400, delay: 0 }));
      openedPopup.current = curPopup;
    } else {
      openedPopup.current = null;
    }
    prevAction = action;
  }

  useEffect(() => {
    leftToggle = select("#sb-toggle-left");
    /**
     * Mobile View
     */
    if (isMobile) {
      select(".sb-left-pane-footer").appendChild(select(".sb-footer-left"));
      select("#left-sidebar").classList.add("sb-hide");
      leftToggle.classList.remove("toggle-active");
    }
    /**
     * Tab View
     */
    if (isTablet || (Browser.isDevice && isPc)) {
      leftToggle.classList.remove("toggle-active");
      select(".sb-right-pane").classList.add("control-fullview");
    }
    if (isRenderDescription) {
      let sbAct = select('.sb-action-description');
      let sbDesc = select('.description-section');
      sbAct.innerHTML = '';
      sbDesc.innerHTML = '';
      let act = select('#action-description');
      let desc = select('#description');
      (actionDescription.current as any).appendChild(act as any);
      (description.current as any).appendChild(desc as any);
      isRenderDescription = false;
    }
  }, [routeName]);

  /**
    * Mobile View.
    */
  let isMobile: boolean = false;
  /**
   * tablet mode
   */
  let isTablet: boolean = false;
  /**
   * PC mode
   */
  let isPc: boolean = false;
  /**
   * Resize event handler
   */
  let resizeManualTrigger: boolean = false;


  if (typeof window !== 'undefined') {
    isMobile = window.matchMedia('(max-width:550px)').matches;
    isTablet = window.matchMedia('(min-width:600px) and (max-width: 850px)').matches;
    isPc = window.matchMedia('(min-width:850px)').matches;
  }

  useEffect(() => {
    let newYear: number = new Date().getFullYear();
    let copyRight: HTMLElement = select('.sb-footer-copyright') as HTMLElement;
    copyRight.innerHTML = "Copyright © 2001 - " + newYear + " Syncfusion Inc.";
    removeOverlay();
  }, []);



  const homeClick = () => {
    (document.getElementById('sb-home') as HTMLElement).click();
  };

  let isDeviceSideBar: boolean = Browser.isDevice || isMobile;


  function resizeFunction(): void {
    if (!isMobile && !isTablet) {
      resizeManualTrigger = true;
      setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 200);
    }
  }

  function toggleLeftPane(): void {
    isMobile = document.body.offsetWidth <= 550;
    select('#left-sidebar').classList.remove('sb-hide');
    leftToggle = select("#sb-toggle-left");
    let reverse: boolean = sidebar.isOpen;
    if (!reverse) {
      leftToggle.classList.add('toggle-active');

    } else {
      leftToggle.classList.remove('toggle-active');
    }
    if (sidebar) {
      reverse = sidebar.isOpen;
      if (reverse) {
        sidebar.hide();
        if (!isMobile && !isTablet) {
          resizeManualTrigger = true;
        }
      } else {
        sidebar.show();
        resizeManualTrigger = true;
      }
    }
  }

  function closeRightSidebar(args: EventArgs): void {
    let targetEle: HTMLElement | null = args.event ? args.event.target as HTMLElement : null;
    if (targetEle && targetEle.closest('.e-popup')) args.cancel = true;
  }

  /**
 * Theme change function
 */

  function changeTheme(e: MouseEvent): void {
    let target: Element = e.target as HTMLElement;
    target = closest(target, 'li');
    let themeName: string = target.id;
    switchTheme(themeName);
  }

  function switchTheme(str: string): void {
    if (str === selectedTheme) {
      return;
    }
    let sbBodyOverlay = select('.sb-body-overlay') as HTMLElement;
    if (sbBodyOverlay.classList.contains('sb-hide')) {
      sbBodyOverlay.classList.remove('sb-hide');
    }
    setTheme(str);
    setTimeout(() => { sbBodyOverlay.classList.add('sb-hide'); }, 1600);

    // let setResponsiveElement: Element = select('.setting-responsive');
    // let hash: string[] = location.pathname.split('/');
    // if (hash[1] !== str) {
    //   hash[1] = str;
    //   location.hash = hash.join('/');
    //   localStorage.setItem('ej2-switch', select('.active', setResponsiveElement).id);
    //   location.reload();
    //   setSbLink();
    // }
  }

  return (
    <>

      <SidebarComponent id='left-sidebar' width={isDeviceSideBar ? '280px' : '282px'} showBackdrop={isDeviceSideBar}
        closeOnDocumentClick={isDeviceSideBar} enableGestures={false} change={resizeFunction} ref={(t: SidebarComponent) => { sidebar = t; }}
        target={isDeviceSideBar ? undefined : '.sb-content'}>
        <div className='sb-left-pane e-view'>
          <div className="sb-left-pane-header">
            <div className="sb-header-top">
              <div className="sb-ej2">
                <div className="sb-mobile-logo"></div>
                <div className="sb-name">Essential JS 2</div>
              </div>
            </div>
          </div>
          <div className="sb-home" onClick={homeClick}>
            <div className="sb-home-link sb-icons sb-icon-Home"></div>
            <div className="sb-home-text">
              <span>HOME</span>
            </div>
            <a id="sb-home" href="https://ej2.syncfusion.com/home/react.html" aria-label="Sample home page"></a>
          </div>
          <div id="left-pane-component">
            <LeftPaneFunc />
          </div>
          <div className='sb-left-pane-footer'>
            <div className="sb-mobile-header-buttons">
              <a href='https://www.syncfusion.com/react-ui-components' target="_blank" aria-label="About React component">
                <div className="sb-mobile-header-about">
                  About</div>
              </a>
              <a href='https://www.syncfusion.com/downloads/react' target="_blank" aria-label="Pricing React components"><div className="sb-mobile-header-price">Pricing</div></a>
            </div>
          </div>
        </div>
      </SidebarComponent>

      <SidebarComponent id='right-sidebar' className="sb-hide" position='Right' width='282' zIndex='1003' showBackdrop={true} type='Over'
        closeOnDocumentClick={true} close={closeRightSidebar}>

        <div className="sb-mobile-right-pane">
          <div className="sb-mobile-preference sb-hide"></div>
          <div className="sb-mobile-prop-pane sb-hide"></div>
          <div className="sb-mobile-right-pane-close sb-icons"></div>
        </div>
      </SidebarComponent>

      <div className="sample-browser e-view">
        <div className="sb-mobile-overlay sb-hide"></div>
        <div id='sample-header' className="sb-header e-view" role="banner">
          <div className='sb-header-left sb-left sb-table'>
            <div className='sb-header-item sb-table-cell'>
              <div id="sb-toggle-left" onClick={toggleLeftPane} className="sb-slide-nav sb-icons toggle-active sb-icon-Hamburger" aria-label="all controls navigation" aria-selected="true"></div>
            </div>
            <div className='sb-header-item sb-table-cell'>
              <div id='sb-header-text' className='e-sb-header-text'>
                <span className='sb-header-text-left'>Essential Studio for </span>
                <span className='sb-header-text-right'>React</span>
              </div>
            </div>
            <div className='sb-header-item sb-table-cell sb-lang-toggler-wrapper'>
              <span id='sb-switcher' className='sb-lang-toggler sb-icons sb-icon-Dropdown'></span>
            </div>
          </div>
          <div className='sb-header-right sb-right sb-table'>
            <div className="sb-header-item sb-table-cell">
              <div id="header-theme-switcher" className="theme-wrapper">
                <div id="sb-theme-text" className="sb-theme-text">
                  <span className="sb-header-text-left">CHOOSE THEME</span>
                </div>
                <div className="sb-theme-switcher-wrapper">
                  <span id="sb-theme-switcher" className="sb-theme-switch sb-icons sb-icon-Dropdown"></span>
                </div>
              </div>
            </div>
            <div className='sb-header-item sb-table-cell sb-search-wrapper'>
              <div className='sb-search-btn' id='sb-trigger-search'>
                <span className='sb-settings sb-icons sb-icon-Search'></span>
              </div>
            </div>
            <div className='sb-header-item sb-table-cell sb-settings-wrapper'>
              <div className='sb-setting-btn'>
                <span className='sb-settings sb-icons sb-icon-Settings-Preferences'></span>
              </div>
            </div>
            <div className="sb-header-item sb-table-cell  sb-header-settings sb-icons"></div>
            <div className="sb-header-splitter sb-download-splitter"></div>
            <div className='sb-header-item sb-table-cell sb-download-wrapper'>
              <Link href="https://www.syncfusion.com/downloads/react" target="_blank" aria-label="Free Trial">
                <button id='download-now' className='sb-download-btn'>
                  <span className="sb-download-text">FREE TRIAL</span>
                </button>
              </Link>
              {/* <a href='https://www.npmjs.com/search?q=ej2-react' target="_blank" aria-label="Intall NPM">
              <button className='sb-npm-btn'>
                <Image className="npm-svg" src="../../styles/images/NPM.svg" width={500} height={500} alt="npm icon"></Image>
                <span className="doc-npm-link">Install NPM</span>
              </button>
            </a> */}
            </div>
          </div>

        </div>
        <div id='sb-popup-section' className='sb-popups'>
          <div id='sb-switcher-popup' className='sb-switch-popup'>
            <ul id='switch-sb'>
              <li className='sb-current'>React</li>
              <li>
                <a id='angular'>Angular</a>
              </li>
              <li>
                <a id='typescript'>JavaScript</a>
              </li>
              <li>
                <a id='javascript'>JavaScript (ES5)</a>
              </li>
              <li>
                <a id='aspnetcore'>ASP.NET Core</a>
              </li>
              <li>
                <a id='aspnetmvc'>ASP.NET MVC</a>
              </li>
              <li>
                <a id='vue'>Vue</a>
              </li>
              <li>
                <a id='blazor'>Blazor</a>
              </li>
            </ul>
          </div>
          <div id='theme-switcher-popup' className='sb-theme-popup'>
            <ul id="themelist" className="options">
              <li className="e-list" id="fluent">
                <span className='sb-icons sb-theme-select sb-icon-icon-selection'></span>
                <span className="switch-text">Fluent</span>
              </li>
              <li className="e-list" id="fluent-dark">
                <span className='sb-icons sb-theme-select sb-icon-icon-selection'></span>
                <span className="switch-text">Fluent Dark</span>
              </li>
              <li className="e-list" id="bootstrap5">
                <span className='sb-icons sb-theme-select sb-icon-icon-selection'></span>
                <span className="switch-text">Bootstrap v5</span>
              </li>
              <li className="e-list" id="bootstrap5-dark">
                <span className='sb-icons sb-theme-select sb-icon-icon-selection'></span>
                <span className="switch-text">Bootstrap v5 dark</span>
              </li>
              <li className="e-list" id="tailwind">
                <span className='sb-icons sb-theme-select sb-icon-icon-selection'></span>
                <span className="switch-text">Tailwind CSS</span>
              </li>
              <li className="e-list" id="tailwind-dark">
                <span className='sb-icons sb-theme-select sb-icon-icon-selection'></span>
                <span className="switch-text">Tailwind CSS Dark</span>
              </li>
              <li className='e-list' id="material">
                <span className='sb-icons sb-theme-select sb-icon-icon-selection'></span>
                <span className="switch-text">Material</span>
              </li>
              <li className="e-list" id="material-dark">
                <span className='sb-icons sb-theme-select sb-icon-icon-selection'></span>
                <span className="switch-text">Material Dark</span>
              </li>
              <li className='active' id="material3">
                <span className='sb-icons sb-theme-select sb-icon-icon-selection'></span>
                <span className="switch-text">Material 3</span>
              </li>
              <li className="e-list" id="material3-dark">
                <span className='sb-icons sb-theme-select sb-icon-icon-selection'></span>
                <span className="switch-text">Material 3 Dark</span>
              </li>
              <li id="fabric">
                <span className='sb-icons sb-theme-select sb-icon-icon-selection'></span>
                <span className="switch-text">Fabric</span>
              </li>
              <li className="e-list" id="fabric-dark">
                <span className='sb-icons sb-theme-select sb-icon-icon-selection'></span>
                <span className="switch-text">Fabric Dark</span>
              </li>
              <li className="e-list" id="bootstrap4">
                <span className='sb-icons sb-theme-select sb-icon-icon-selection'></span>
                <span className="switch-text">Bootstrap v4</span>
              </li>
              <li className="e-list" id="bootstrap">
                <span className='sb-icons sb-theme-select sb-icon-icon-selection'></span>
                <span className="switch-text">Bootstrap</span>
              </li>
              <li className="e-list" id="bootstrap-dark">
                <span className='sb-icons sb-theme-select sb-icon-icon-selection'></span>
                <span className="switch-text">Bootstrap Dark</span>
              </li>
              <li className="e-list" id="highcontrast">
                <span className='sb-icons sb-theme-select sb-icon-icon-selection'></span>
                <span className="switch-text">High Contrast</span>
              </li>
              <div className="sb-theme-studio"><a target="_blank" href="https://ej2.syncfusion.com/themestudio/?theme=material" aria-label="Go to Theme Studio">Go to Theme Studio</a></div>
            </ul>
          </div>
          <div id='settings-popup' className='sb-setting-popup'>
            <div className='sb-setting-header'>
              <span> Preferences
              </span>
            </div>
            <div className='sb-setting-content'>

              <div className='sb-setting-item sb-setting-theme-section'>
                <div className='setting-label'>
                  <div className='sb-icons sb-setting-icons sb-icon-Palette'></div>
                  <div className='sb-setting-text'>Theme Selection</div>
                </div>
                <div className='setting-content  setting-theme-change'>
                  <DropDownListComponent id='sb-setting-theme' className='sb-setting-theme-select'>
                    <option value="fluent">Fluent</option>
                    <option value="fluent-dark">Fluent Dark</option>
                    <option value="bootstrap5">Bootstrap v5</option>
                    <option value="bootstrap5-dark">Bootstrap v5 Dark</option>
                    <option value="tailwind">Tailwind CSS</option>
                    <option value="tailwind-dark">Tailwind CSS Dark</option>
                    <option value="material">Material</option>
                    <option value="material-dark">Material Dark</option>
                    <option value="material3">Material 3</option>
                    <option value="material3-dark">Material 3 Dark</option>
                    <option value="fabric">Fabric</option>
                    <option value="fabric-dark">Fabric Dark</option>
                    <option value="bootstrap4">Bootstrap v4</option>
                    <option value="bootstrap">Bootstrap</option>
                    <option value="bootstrap-dark">Bootstrap Dark</option>
                    <option value="highcontrast">High Contrast</option>
                  </DropDownListComponent>
                  {/* <select  className='sb-setting-theme-select'>
                    
                  </select> */}
                </div>
              </div>
              <div className='sb-setting-item sb-responsive-section'>
                <div className='setting-label'>
                  <div className='sb-icons sb-setting-icons sb-icon-Responsive'></div>
                  <div className='sb-setting-text'>Mode Selection</div>
                </div>
                <div className='setting-content btn-group setting-responsive'>
                  <div id='touch' className="sb-responsive-items set-border-radious-touch">Touch</div>
                  <div id='mouse' className="sb-responsive-items set-border-radious-mouse">Mouse</div>
                </div>
              </div>
              <div className='sb-setting-item sb-setting-culture'>
                <div className='setting-label'>
                  <div className='sb-icons sb-setting-icons sb-icon-Localization'></div>
                  <div className='sb-setting-text'>Localization</div>
                </div>
                <div className='setting-content'>
                  <DropDownListComponent id='sb-setting-culture' className='sb-setting-culture-select'>
                      <option value="en">English</option>
                      <option value="de">German - Germany*</option>
                      <option value="fr-CH">French - Switzerland*</option>
                      <option value="ar">Arabic*</option>
                      <option value="zh">Chinese - China*</option>
                  </DropDownListComponent>

                </div>
                <div className="sb-setting-translate">
                  <span>* Translated by Google Translator</span>
                </div>
              </div>
              <div className='sb-setting-item sb-setting-currency'>
                <div className='setting-label'>
                  <div className='sb-icons sb-setting-icons sb-icon-Currency'></div>
                  <div className='sb-setting-text'>Currency</div>
                </div>
                <div className='setting-content'>
                  <select id='sb-setting-currency' className='sb-setting-currency-content'>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="AED">AED</option>
                    <option value="CHF">CHF</option>
                    <option value="CNY">CNY</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sb-content e-view">
          <div className='sb-right-pane e-view' id='right-pane'>
            <div className="sb-content-overlay">
              <div className="sb-loading">
                <svg className="circular" height="40" width="40">
                  <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth={6} strokeMiterlimit={10} />
                </svg>
              </div>
            </div>
            <div className='sb-desktop-wrapper'>
              <div id='component-name' role="heading" className='sb-component-name sb-rightpane-padding'>
                <h1 className='sb-sample-text' role="heading" aria-level={1} />
              </div>
              <div id='sample-bread-crumb' className='sb-bread-crumb sb-rightpane-padding'>
                <div className='sb-bread-crumb-text'>
                  <div className='category-text bread-ctext'> </div>
                  <div className='category-seperator sb-icons sb-icon-Next seperator'> </div>
                  <div className='component  bread-ctext'></div>
                  <div className="component-seperator sb-icons  sb-icon-Next seperator"> </div>
                  <div className='crumb-sample '></div>
                </div>
              </div>
              <div className='sb-action-description sb-rightpane-padding' ref={actionDescription}>
              </div>
              <div id='tab-component'>
                <Content theme={theme}>{children}</Content>
              </div>
              <div className='description-section sb-rightpane-padding' ref={description}>
              </div>


              <div className="post-wrapper">
                <div id='post-image' className="post-img">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="col-sm-12">
                        <div id="post-banner-head" className="post-header">Transform your React web apps today with Syncfusion React components</div>
                      </div>
                      <div className="col-sm-12 cnt-area">
                        <div className="content-area">
                          <div className="post-cnt-pt">
                            <div className="post-cnt-icon click-icon sb-icons sb-icon-icon-selection"></div>
                            <div className="cnt-text">80+ high-performance and responsive UI components</div>
                          </div>
                          <div className="post-cnt-pt">
                            <div className="post-cnt-icon click-icon sb-icons sb-icon-icon-selection"></div>
                            <div className="cnt-text">Dedicated support</div>
                          </div>
                          <div className="post-cnt-pt">
                            <div className="post-cnt-icon click-icon sb-icons sb-icon-icon-selection"></div>
                            <div className="cnt-text">Hassle-free licensing</div>
                          </div>
                        </div>
                        <Link href="https://www.syncfusion.com/downloads/react" aria-label="Try it for free" legacyBehavior>
                          <a style={{ color: '#ffff', textDecoration: 'none' }}>
                            <div className="free-trial">TRY IT FOR FREE</div>
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sb-footer">
                <div className="sb-footer-left">
                  <div className="sb-footer-links">
                    <a href="http://ej2.syncfusion.com/react/documentation" target="_blank" aria-label="Documentation link">
                      <div className="sb-footer-link">Documentation</div>
                    </a>
                    <a href="https://www.syncfusion.com/forums/react-js2" target="_blank" aria-label="Forum link">
                      <div className="sb-footer-link">Forum</div>
                    </a>
                    <a href="https://syncfusion.com/blogs" target="_blank" aria-label="Blog link">
                      <div className="sb-footer-link">Blog</div>
                    </a>
                    <a href="https://www.syncfusion.com/kb" target="_blank" aria-label="Knowledge base">
                      <div className="sb-footer-link">Knowledge Base</div>
                    </a>
                  </div>
                  <div className="sb-footer-copyright"></div>
                </div>
                <div className="sb-footer-logo">
                  <a href="//www.syncfusion.com" target="_blank" aria-label="Sample footer logo">
                    <div className="sb-footer-logo-icon"></div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="sb-body-overlay e-view">
            <div className="sb-loading">
              <svg className="circular" height="40" width="40">
                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth={6} strokeMiterlimit={10} />
              </svg>
            </div>
          </div>
          <div className="e-search-overlay sb-hide">
            <div className='sb-search-input' id='search-input-wrapper' data-value=''>
              <input type='text' className="e-icons" id='search-input' placeholder="Search here..." />
              <span className='e-icons sb-reset-icon'></span>
              <span className='e-icons  sb-search-icon'></span>
            </div>
            <div id='search-popup' className='sb-search-result' ></div>
          </div>
          <div className='sb-mobilefooter e-view sample-navigation' id='mobile-footer'>
            <ButtonComponent id='mobile-prev-sample' className="sb-navigation-prev sb-left" iconCss='sb-icons sb-icon-Previous' cssClass='e-flat'>
              PREVIOUS
            </ButtonComponent>
            <ButtonComponent id='mobile-next-sample' className="sb-navigation-next sb-right"
              iconCss='sb-icons sb-icon-Next' cssClass='e-flat' iconPosition='Right'>
              NEXT
            </ButtonComponent>
          </div>
        </div>
      </div>
    </>
  )
}
