<?php

namespace Kanboard\Plugin\Calendar;

use Kanboard\Core\Plugin\Base;
use Kanboard\Core\Translator;
use Kanboard\Plugin\Calendar\Formatter\TaskCalendarFormatter;

class Plugin extends Base
{
    public function initialize()
    {
        $this->helper->register('calendar', '\Kanboard\Plugin\Calendar\Helper\CalendarHelper');

        $this->container['taskCalendarFormatter'] = $this->container->factory(function ($c) {
            return new TaskCalendarFormatter($c);
        });

        $this->template->hook->attach('template:dashboard:page-header:menu', 'Calendar:dashboard/menu');
        $this->template->hook->attach('template:project:dropdown', 'Calendar:project/dropdown');
        $this->template->hook->attach('template:project-header:view-switcher', 'Calendar:project_header/views');
        $this->template->hook->attach('template:config:sidebar', 'Calendar:config/sidebar');
    }

    public function onStartup()
    {
        Translator::load($this->languageModel->getCurrentLanguage(), __DIR__.'/Locale');
    }

    public function getPluginName()
    {
        return 'Calendar';
    }

    public function getPluginDescription()
    {
        return t('Calendar view for Kanboard');
    }

    public function getPluginAuthor()
    {
        return 'Frédéric Guillot';
    }

    public function getPluginVersion()
    {
        return '1.0.0';
    }

    public function getPluginHomepage()
    {
        return 'https://github.com/kanboard/plugin-calendar';
    }
}
