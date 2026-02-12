import AuthenticationServices
import FBSDKCoreKit
import Firebase
import GoogleMaps
import GooglePlaces
import React
import ReactAppDependencyProvider
import React_RCTAppDelegate
import SafariServices
import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate, MessagingDelegate {
    var window: UIWindow?

    var reactNativeDelegate: ReactNativeDelegate?
    var reactNativeFactory: RCTReactNativeFactory?

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        // Configure Firebase
        FirebaseApp.configure()
        Messaging.messaging().delegate = self

        // Configure Google Maps/Places
        if let googlePlacesKey = Bundle.main.object(
            forInfoDictionaryKey: "PROJECT_GOOGLE_PLACE_KEY") as? String
        {
            GMSServices.provideAPIKey(googlePlacesKey)
            GMSPlacesClient.provideAPIKey(googlePlacesKey)
        }

        let delegate = ReactNativeDelegate()
        let factory = RCTReactNativeFactory(delegate: delegate)
        delegate.dependencyProvider = RCTAppDependencyProvider()

        reactNativeDelegate = delegate
        reactNativeFactory = factory

        window = UIWindow(frame: UIScreen.main.bounds)

        factory.startReactNative(
            withModuleName: "Runrun",
            in: window,
            launchOptions: launchOptions
        )

        return true
    }

    func application(
        _ app: UIApplication,
        open url: URL,
        options: [UIApplication.OpenURLOptionsKey: Any] = [:]
    ) -> Bool {
        return ApplicationDelegate.shared.application(
            app,
            open: url,
            options: options
        ) || RCTLinkingManager.application(app, open: url, options: options)
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Clear pasteboard
        UIPasteboard.general.string = ""
    }

    func application(
        _ application: UIApplication,
        continue userActivity: NSUserActivity,
        restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
    ) -> Bool {
        return RCTLinkingManager.application(
            application,
            continue: userActivity,
            restorationHandler: restorationHandler
        )
    }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
    override func sourceURL(for bridge: RCTBridge) -> URL? {
        self.bundleURL()
    }

    override func bundleURL() -> URL? {
        #if DEBUG
            RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
        #else
            Bundle.main.url(forResource: "main", withExtension: "jsbundle")
        #endif
    }
}
