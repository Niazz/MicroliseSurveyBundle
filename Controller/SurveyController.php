<?php
/**
 * Created by PhpStorm.
 * User: niaz
 * Date: 23/03/15
 * Time: 14:31
 */

namespace Microlise\SurveyBundle\Controller;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class SurveyController extends controller
{
    public function indexAction()
    {
        $name = "hello niaz";

        $oldsurveys = "survey1, survey2";

        return $this->render(
            'MicroliseSurveyBundle:Survey:index.html.twig',
            array('name' => $name, 'oldsurveys' => $oldsurveys)
        );

    }

    public function createAction()
    {

        return $this->render(
            'MicroliseSurveyBundle:Survey:create.html.twig',
            array()
        );

    }

    public function analyticsAction()
    {

    }

}