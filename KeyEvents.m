#import "KeyEvents.h"

@implementation KeyEvents

-(void)keyDown:(NSEvent *)event {
    NSString *character;
    character = [event characters];
// CDVPluginResult *pluginResult =
//         [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:character];
//     [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
self.latestCharacter = [event characters]
[self sendKeyEvent]
}

- (void)sendKeyEvent:(NSNotification*)notification
{
    if (self.callbackId) {
        NSString *character;
        character = self.latestCharacter;
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:character];
        [result setKeepCallbackAsBool:YES];
        [self.commandDelegate sendPluginResult:result callbackId:self.callbackId];
    }
}

/* turn on battery monitoring*/
- (void)start:(CDVInvokedUrlCommand*)command
{
    self.callbackId = command.callbackId;

    if (self.keyEventMonitoringEnabled == NO) {
        self.keyEventMonitoringEnabled = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(sendKeyEvent:)
                                                     name:KeyEventsBroadcast object:nil];
    }
}

/* turn off battery monitoring */
- (void)stop:(CDVInvokedUrlCommand*)command
{
    // callback one last time to clear the callback function on JS side
    if (self.callbackId) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:[self sendKeyEvent]];
        [result setKeepCallbackAsBool:NO];
        [self.commandDelegate sendPluginResult:result callbackId:self.callbackId];
    }
    self.callbackId = nil;
    [self.keyEventMonitoringEnabled = NO;
    [[NSNotificationCenter defaultCenter] removeObserver:self name:KeyEventsBroadcast object:nil];
}

- (void)dealloc
{
    [self stop:nil];
}

@end