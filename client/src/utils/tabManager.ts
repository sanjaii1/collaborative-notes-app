// Tab Manager for multi-tab authentication
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
    // Store tab info in sessionStorage
    sessionStorage.setItem('currentTabId', this.tabId);
    
    // Listen for storage changes from other tabs
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    
    // Clean up when tab is closed
    window.addEventListener('beforeunload', () => {
      this.cleanupTab();
    });
  }

  private handleStorageChange(event: StorageEvent): void {
    // Handle changes from other tabs if needed
    if (event.key === 'currentTabId' && event.newValue !== this.tabId) {
      // Another tab was created
      console.log('New tab detected:', event.newValue);
    }
  }

  private cleanupTab(): void {
    // Clean up tab-specific data when tab is closed
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