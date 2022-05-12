interface IToolbarButton {
    title: string;
    ui: { type: string; },
    property: string;
}

interface IInitializeOptions {
    title: string;
    toolbarButtons: IToolbarButton[];
}

interface IFrescoSdk {
    onReady(callback: () => void): void;
    onStateChanged(callback: () => void): void;
    element: {
        state: any; 
    };
    setState(state: any): void;
    initialize(defaultState: any, options: IInitializeOptions): void;
}


declare var fresco: IFrescoSdk;
