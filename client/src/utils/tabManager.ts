export class TabManager {
  private static instance: TabManager;
  private tabId: string;
  private storageKey: string;

  private constructor() {
    this.tabId = this.generateTabId();
    this.storageKey = `auth-tab-${this.tabId}`;
    this.initializeTab();
  }

  public static getInstance(): TabManager {
    if (!TabManager.instance) {
      TabManager.instance = new TabManager();
    }
    return TabManager.instance;
  }

  private generateTabId(): string {
    return `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeTab(): void {
    sessionStorage.setItem('currentTabId', this.tabId);
    
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    
    window.addEventListener('beforeunload', () => {
      this.cleanupTab();
    });
  }

  private handleStorageChange(event: StorageEvent): void {
    if (event.key === 'currentTabId' && event.newValue !== this.tabId) {
      console.log('New tab detected:', event.newValue);
    }
  }

  private cleanupTab(): void {
    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem('currentTabId');
  }

  public getTabId(): string {
    return this.tabId;
  }

  public getStorageKey(): string {
    return this.storageKey;
  }

  public setTabData(key: string, value: any): void {
    const data = this.getTabData();
    data[key] = value;
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  public getTabData(): Record<string, any> {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : {};
  }

  public getTabDataByKey(key: string): any {
    const data = this.getTabData();
    return data[key];
  }

  public removeTabData(key: string): void {
    const data = this.getTabData();
    delete data[key];
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  public clearTabData(): void {
    localStorage.removeItem(this.storageKey);
  }

  public getAllTabs(): string[] {
    const tabs: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('auth-tab-')) {
        tabs.push(key);
      }
    }
    return tabs;
  }
}

export const tabManager: TabManager = TabManager.getInstance(); 