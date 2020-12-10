import { ChildClient } from '@datadog/framepost';

import { DDAPIClient } from '../api/api';
import { Host } from '../constants';
import { DDEventsClient } from '../events/events';
import type { Context, FrameContext, ClientOptions } from '../types';
import { getLogger, Logger } from '../utils/logger';

declare const SDK_VERSION: string;

const DEFAULT_OPTIONS = {
    host: Host.STAGE,
    debug: false
};

export class DDClient {
    private readonly host: string;
    private readonly debug: boolean;
    private readonly framePostClient: ChildClient<Context>;
    private readonly logger: Logger;
    api: DDAPIClient;
    events: DDEventsClient;

    constructor(options: ClientOptions = {}) {
        this.host = options.host || DEFAULT_OPTIONS.host;
        this.debug = options.debug || DEFAULT_OPTIONS.debug;

        this.framePostClient = new ChildClient<Context>({
            debug: this.debug,
            profile: this.debug,
            context: {
                sdkVersion: SDK_VERSION
            } as FrameContext
        });

        this.logger = getLogger(options);

        this.api = new DDAPIClient(
            this.debug,
            this.logger,
            this.framePostClient
        );

        this.events = new DDEventsClient(
            this.debug,
            this.logger,
            this.framePostClient
        );
    }

    /**
     * Returns app context data, after it is sent from the parent
     */
    async getContext(): Promise<Context> {
        return this.framePostClient.getContext();
    }
}