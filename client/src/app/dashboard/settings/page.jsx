
"use client";

import { useEffect, useState } from "react";
import {
  FiSettings,
  FiBell,
  FiMail,
  FiShoppingBag,
  FiTag,
  FiMoon,
  FiSun,
  FiShield,
  FiLock,
  FiSave,
  FiRotateCcw,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";

import styles from "./settings.module.css";

const DEFAULT_SETTINGS = {
  orderUpdates: true,
  emailNotifications: true,
  promotionalOffers: false,
  appearance: "light",
};

export default function CustomerSettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("homebite-settings");

      if (stored) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...JSON.parse(stored),
        });
      }
    } catch (error) {
      console.error("Could not load settings:", error);
    }
  }, []);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    setSaved(false);
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSave = () => {
    try {
      localStorage.setItem(
        "homebite-settings",
        JSON.stringify(settings)
      );

      setSaved(true);
      showToast("Your settings have been saved successfully!");
    } catch (error) {
      showToast("Unable to save settings. Please try again.");
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem(
      "homebite-settings",
      JSON.stringify(DEFAULT_SETTINGS)
    );

    setSaved(true);
    showToast("Settings restored to default!");
  };

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={`${styles.pageHeader} hb-reveal`}>
        <div>
          <span className={styles.eyebrow}>
            <FiSettings /> PERSONALIZE YOUR EXPERIENCE
          </span>

          <h1>Account Settings</h1>

          <p>
            Manage your preferences and customize your HomeBite experience.
          </p>
        </div>

        <div className={styles.headerIcon}>
          <FiSettings />
        </div>
      </div>

      {/* Settings Content */}
      <div className={styles.settingsContainer}>
        {/* Notifications */}
        <section className={`${styles.settingsCard} hb-reveal`}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FiBell />
            </div>

            <div>
              <h2>Notification Preferences</h2>
              <p>Choose which notifications you want to receive.</p>
            </div>
          </div>

          <div className={styles.settingList}>
            <SettingToggle
              icon={<FiShoppingBag />}
              title="Order Updates"
              description="Receive updates about your orders and delivery status."
              checked={settings.orderUpdates}
              onChange={(value) =>
                updateSetting("orderUpdates", value)
              }
            />

            <SettingToggle
              icon={<FiMail />}
              title="Email Notifications"
              description="Receive important updates and notifications through email."
              checked={settings.emailNotifications}
              onChange={(value) =>
                updateSetting("emailNotifications", value)
              }
            />

            <SettingToggle
              icon={<FiTag />}
              title="Promotional Offers"
              description="Get notified about discounts, special deals and offers."
              checked={settings.promotionalOffers}
              onChange={(value) =>
                updateSetting("promotionalOffers", value)
              }
            />
          </div>
        </section>

        {/* Appearance */}
        <section className={`${styles.settingsCard} hb-reveal`}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FiSun />
            </div>

            <div>
              <h2>Appearance</h2>
              <p>Choose your preferred dashboard appearance.</p>
            </div>
          </div>

          <div className={styles.appearanceOptions}>
            <button
              type="button"
              className={`${styles.appearanceOption} ${
                settings.appearance === "light" ? styles.activeAppearance : ""
              }`}
              onClick={() => updateSetting("appearance", "light")}
            >
              <span className={styles.appearanceIcon}>
                <FiSun />
              </span>

              <span>
                <strong>Light Mode</strong>
                <small>Bright and comfortable</small>
              </span>

              {settings.appearance === "light" && (
                <FiCheckCircle className={styles.selectedIcon} />
              )}
            </button>

            <button
              type="button"
              className={`${styles.appearanceOption} ${
                settings.appearance === "dark" ? styles.activeAppearance : ""
              }`}
              onClick={() => updateSetting("appearance", "dark")}
            >
              <span className={styles.appearanceIcon}>
                <FiMoon />
              </span>

              <span>
                <strong>Dark Mode</strong>
                <small>Comfortable in low light</small>
              </span>

              {settings.appearance === "dark" && (
                <FiCheckCircle className={styles.selectedIcon} />
              )}
            </button>
          </div>

          <div className={styles.infoNote}>
            <FiInfo />
            <span>
              This saves your appearance preference. It does not change the
              entire dashboard theme yet.
            </span>
          </div>
        </section>

        {/* Security */}
        <section className={`${styles.settingsCard} hb-reveal`}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FiShield />
            </div>

            <div>
              <h2>Account Security</h2>
              <p>Keep your HomeBite account safe and secure.</p>
            </div>
          </div>

          <div className={styles.securityBox}>
            <div className={styles.securityIcon}>
              <FiLock />
            </div>

            <div className={styles.securityText}>
              <h3>Password & Login</h3>
              <p>
                Keep your login credentials private and never share your
                password with anyone.
              </p>
            </div>

            <span className={styles.securityStatus}>
              <FiCheckCircle /> Protected
            </span>
          </div>
        </section>

        {/* Save Actions */}
        <div className={`${styles.actions} hb-reveal`}>
          <button
            type="button"
            className={styles.resetButton}
            onClick={handleReset}
          >
            <FiRotateCcw />
            Reset to Default
          </button>

          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSave}
          >
            <FiSave />
            {saved ? "Saved Successfully" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={styles.toast}>
          <FiCheckCircle />
          {toast}
        </div>
      )}
    </div>
  );
}

function SettingToggle({ icon, title, description, checked, onChange }) {
  return (
    <div className={styles.settingRow}>
      <div className={styles.settingInfo}>
        <div className={styles.settingIcon}>{icon}</div>

        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        className={`${styles.toggle} ${
          checked ? styles.toggleActive : ""
        }`}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
    </div>
  );
}
