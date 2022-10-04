import Layout from "../components/Layout.vue";
import TorrentDetail from "../views/torrents/torrent-view/Torrent.vue";
import CategoryOverview from "../views/CategoryOverview.vue";
import TorrentUpload from "../views/TorrentUpload.vue";
import VueRouter from "vue-router";
import Torrents from "../views/torrents/Torrents.vue";
import Welcome from "../views/Welcome.vue";
import Settings from "../views/settings/Settings.vue";
import GeneralSettings from "../views/settings/tabs/GeneralSettings.vue";
import TrackerSettings from "../views/settings/tabs/TrackerSettings.vue";
import AuthenticationSettings from "../views/settings/tabs/AuthenticationSettings.vue";
import DatabaseSettings from "../views/settings/tabs/DatabaseSettings.vue";
import EmailSettings from "../views/settings/tabs/EmailSettings.vue";

const routes = [
    {
        path: '/',
        component:
        Layout,
        children: [
            {
                path: '/',
                name: 'Welcome',
                component: Welcome,
            },
            {
                path: 'settings',
                name: 'Settings',
                component: Settings,
                children: [
                    {
                        path: 'general',
                        component: GeneralSettings
                    },
                    {
                        path: 'tracker',
                        component: TrackerSettings
                    },
                    {
                        path: 'authentication',
                        component: AuthenticationSettings
                    },
                    {
                        path: 'database',
                        component: DatabaseSettings
                    },
                    {
                        path: 'email',
                        component: EmailSettings
                    },
                ]
            },
            {
                path: 'categories',
                name: "Category's",
                component: CategoryOverview
            },
            {
                path: 'torrent/:torrentId/:title?/:download?',
                name: 'Torrent',
                component: TorrentDetail
            },
            {
                path: 'torrents/:sorting?',
                name: 'Browse Torrents',
                component: Torrents,
            },
            {
                path: 'upload',
                name: 'Upload Torrent',
                component: TorrentUpload
            },
        ]
    }
];

const router = new VueRouter({
    mode: 'history',
    routes
});

export default router
