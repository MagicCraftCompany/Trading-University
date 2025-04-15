declare module 'animejs' {
  interface AnimeParams {
    targets: string | Element | Element[] | NodeList;
    opacity?: number | [number, number];
    boxShadow?: string | string[];
    duration?: number;
    easing?: string;
    loop?: boolean | number;
    direction?: 'normal' | 'reverse' | 'alternate';
    delay?: number | Function;
    endDelay?: number;
    autoplay?: boolean;
    [key: string]: any;
  }

  interface AnimeInstance {
    play: () => void;
    pause: () => void;
    restart: () => void;
    reverse: () => void;
    seek: (time: number) => void;
    [key: string]: any;
  }

  interface AnimeScope {
    animate: (targets: string | Element | Element[] | NodeList, params: Omit<AnimeParams, 'targets'>) => AnimeInstance;
    add: (callback: (scope: AnimeScope) => void) => AnimeScope;
    revert: () => void;
  }

  interface AnimeStatic {
    (params: AnimeParams): AnimeInstance;
    version: string;
    speed: number;
    running: AnimeInstance[];
    easings: { [name: string]: (t: number) => number };
    remove(targets: string | Element | Element[] | NodeList): void;
    get(targets: string | Element | Element[] | NodeList): AnimeInstance;
    set(targets: string | Element | Element[] | NodeList, values: Object): void;
    timeline(params?: AnimeParams): AnimeInstance;
    random(min: number, max: number): number;
    createScope(options: { root: Element | null }): AnimeScope;
  }

  const anime: AnimeStatic;
  export const createScope: (options: { root: Element | null }) => AnimeScope;
  export default anime;
} 