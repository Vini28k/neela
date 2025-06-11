package com.neela.mentalweather;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;
import android.webkit.WebView;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "MentalWeatherApp";
    private static final int PERMISSION_REQUEST_CODE = 1001;
    
    // Required permissions for the app
    private static final String[] REQUIRED_PERMISSIONS = {
        Manifest.permission.BLUETOOTH,
        Manifest.permission.BLUETOOTH_ADMIN,
        Manifest.permission.ACCESS_FINE_LOCATION,
        Manifest.permission.ACCESS_COARSE_LOCATION,
        Manifest.permission.POST_NOTIFICATIONS,
        Manifest.permission.VIBRATE,
        Manifest.permission.WAKE_LOCK,
        Manifest.permission.FOREGROUND_SERVICE,
        Manifest.permission.INTERNET,
        Manifest.permission.ACCESS_NETWORK_STATE,
        Manifest.permission.CAMERA,
        Manifest.permission.CALL_PHONE
    };
    
    // Android 12+ (API 31+) Bluetooth permissions
    private static final String[] BLUETOOTH_PERMISSIONS_API_31 = {
        Manifest.permission.BLUETOOTH_SCAN,
        Manifest.permission.BLUETOOTH_CONNECT,
        Manifest.permission.BLUETOOTH_ADVERTISE
    };

    // Permission launcher for handling permission requests
    private ActivityResultLauncher<String[]> permissionLauncher;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        Log.d(TAG, "Mental Weather App starting...");
        
        // Initialize permission launcher
        initializePermissionLauncher();
        
        // Enable WebView debugging in development
        if (BuildConfig.DEBUG) {
            WebView.setWebContentsDebuggingEnabled(true);
        }
        
        // Register Capacitor plugins
        registerPlugins();
        
        // Request necessary permissions
        requestRequiredPermissions();
        
        Log.d(TAG, "MainActivity initialized successfully");
    }

    /**
     * Initialize the permission request launcher
     */
    private void initializePermissionLauncher() {
        permissionLauncher = registerForActivityResult(
            new ActivityResultContracts.RequestMultiplePermissions(),
            result -> {
                List<String> deniedPermissions = new ArrayList<>();
                for (String permission : result.keySet()) {
                    if (!Boolean.TRUE.equals(result.get(permission))) {
                        deniedPermissions.add(permission);
                    }
                }
                
                if (!deniedPermissions.isEmpty()) {
                    Log.w(TAG, "Some permissions were denied: " + deniedPermissions);
                    handleDeniedPermissions(deniedPermissions);
                } else {
                    Log.d(TAG, "All permissions granted successfully");
                    onAllPermissionsGranted();
                }
            }
        );
    }

    /**
     * Register Capacitor plugins
     */
    private void registerPlugins() {
        // Register any additional plugins here
        // Example: this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
        //     add(SomePlugin.class);
        // }});
    }

    /**
     * Request all required permissions
     */
    private void requestRequiredPermissions() {
        List<String> permissionsToRequest = new ArrayList<>();
        
        // Check standard permissions
        for (String permission : REQUIRED_PERMISSIONS) {
            if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                permissionsToRequest.add(permission);
            }
        }
        
        // Check Android 12+ Bluetooth permissions
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            for (String permission : BLUETOOTH_PERMISSIONS_API_31) {
                if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                    permissionsToRequest.add(permission);
                }
            }
        }
        
        if (!permissionsToRequest.isEmpty()) {
            Log.d(TAG, "Requesting permissions: " + permissionsToRequest);
            permissionLauncher.launch(permissionsToRequest.toArray(new String[0]));
        } else {
            Log.d(TAG, "All permissions already granted");
            onAllPermissionsGranted();
        }
    }

    /**
     * Handle denied permissions
     */
    private void handleDeniedPermissions(List<String> deniedPermissions) {
        List<String> criticalPermissions = Arrays.asList(
            Manifest.permission.BLUETOOTH,
            Manifest.permission.BLUETOOTH_ADMIN,
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.POST_NOTIFICATIONS
        );
        
        // Check if any critical permissions were denied
        boolean criticalDenied = false;
        for (String permission : deniedPermissions) {
            if (criticalPermissions.contains(permission)) {
                criticalDenied = true;
                break;
            }
        }
        
        if (criticalDenied) {
            Log.w(TAG, "Critical permissions denied. App functionality may be limited.");
            // You could show a dialog explaining why permissions are needed
            // or redirect to app settings
        }
        
        // Check for permanently denied permissions
        for (String permission : deniedPermissions) {
            if (!ActivityCompat.shouldShowRequestPermissionRationale(this, permission)) {
                Log.w(TAG, "Permission permanently denied: " + permission);
                // Could show dialog to go to app settings
            }
        }
    }

    /**
     * Called when all permissions are granted
     */
    private void onAllPermissionsGranted() {
        Log.d(TAG, "All permissions granted. App ready for full functionality.");
        
        // Initialize services that require permissions
        initializeBluetoothServices();
        initializeNotificationServices();
    }

    /**
     * Initialize Bluetooth-related services
     */
    private void initializeBluetoothServices() {
        try {
            // Initialize Bluetooth adapter and services
            Log.d(TAG, "Initializing Bluetooth services...");
            // Add Bluetooth initialization code here
        } catch (Exception e) {
            Log.e(TAG, "Failed to initialize Bluetooth services", e);
        }
    }

    /**
     * Initialize notification services
     */
    private void initializeNotificationServices() {
        try {
            // Initialize notification channels and services
            Log.d(TAG, "Initializing notification services...");
            // Add notification initialization code here
        } catch (Exception e) {
            Log.e(TAG, "Failed to initialize notification services", e);
        }
    }

    /**
     * Open app settings for manual permission management
     */
    private void openAppSettings() {
        Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        Uri uri = Uri.fromParts("package", getPackageName(), null);
        intent.setData(uri);
        startActivity(intent);
    }

    @Override
    protected void onResume() {
        super.onResume();
        Log.d(TAG, "MainActivity resumed");
        
        // Check if permissions were granted while app was in background
        if (hasAllRequiredPermissions()) {
            onAllPermissionsGranted();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        Log.d(TAG, "MainActivity paused");
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "MainActivity destroyed");
    }

    /**
     * Check if all required permissions are granted
     */
    private boolean hasAllRequiredPermissions() {
        for (String permission : REQUIRED_PERMISSIONS) {
            if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                return false;
            }
        }
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            for (String permission : BLUETOOTH_PERMISSIONS_API_31) {
                if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                    return false;
                }
            }
        }
        
        return true;
    }

    /**
     * Handle new intents (for deep linking)
     */
    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        Log.d(TAG, "New intent received: " + intent.getAction());
        
        // Handle deep links or other intents
        if (Intent.ACTION_VIEW.equals(intent.getAction())) {
            Uri data = intent.getData();
            if (data != null) {
                Log.d(TAG, "Deep link received: " + data.toString());
                // Handle deep link navigation
            }
        }
    }

    /**
     * Handle back button press
     */
    @Override
    public void onBackPressed() {
        // Let Capacitor handle the back button
        if (!getBridge().onBackPressed()) {
            super.onBackPressed();
        }
    }
}