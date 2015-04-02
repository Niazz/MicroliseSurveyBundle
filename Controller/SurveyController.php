<?php
/**
 * Created by PhpStorm.
 * User: niaz
 * Date: 23/03/15
 * Time: 14:31
 */

namespace Microlise\SurveyBundle\Controller;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Microlise\SurveyBundle\Entity\Survey;
use Microlise\SurveyBundle\Entity\Question;
use Microlise\SurveyBundle\Entity\Answer;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

use Microlise\SurveyBundle\Form\Type\SurveyType;
use Microlise\SurveyBundle\Form\Type\QuestionType;


class SurveyController extends controller
{
    public function indexAction()
    {
        $repository = $this->getDoctrine()
            ->getRepository('MicroliseSurveyBundle:Survey');
        $survey = $repository->findAll();

        return $this->render(
            'MicroliseSurveyBundle:Survey:index.html.twig',
            array('survey' => $survey)
        );

    }

    public function createAction(Request $request)
    {

     /*   $survey = new Survey();
        $survey->setName('Test Survey1');
        $survey->setDescription('Lorem ipsum dolor');

        $em = $this->getDoctrine()->getManager();

        $em->persist($survey);
        $em->flush();

        return new Response('Created survey id '.$survey->getId());*/

// create a task and give it some dummy data for this example

        $id = uniqid();
//print_r($id);


        $em = $this->getDoctrine()->getManager();

        $surveyform = $this->createForm(new SurveyType());

        $surveyform->handleRequest($request);

        if ($surveyform->isValid()) {

            $survey = $surveyform->getData();

            $em->persist($survey);
            $em->flush();

          //  $this->questionAction($request, $id);*/

            return $this->redirect($this->generateUrl('microlise_survey_create_question'));
        }



       // $id = $survey->getId();

        return $this->render('MicroliseSurveyBundle:Survey:create.html.twig', array(
            'surveyform' => $surveyform->createView(),

        ));

    }

    public function questionAction(Request $request)
    {
        $id = uniqid();
        print_r($id);

        $em = $this->getDoctrine()->getManager();

        $questionform = $this->createForm(new QuestionType());

        $questionform->handleRequest($request);


        if ($questionform->isValid()) {

            $questions = $questionform->getData();

            $em->persist($questions);
            $em->flush();

            return $this->redirect($this->generateUrl('microlise_survey_create'));
        }

        return $this->render('MicroliseSurveyBundle:Survey:questions.html.twig', array(
            'questionform' => $questionform->createView(),
        ));

    }

    public function displayAction($id)
    {
        $survey = $this->getDoctrine()
            ->getRepository('MicroliseSurveyBundle:Survey')
            ->find($id);

      //  print_r($survey);
        return $this->render('MicroliseSurveyBundle:Survey:viewSurvey.html.twig', array('survey' => $survey));
    }



    public function buildSurveyAction()
    {

        $repository = $this->getDoctrine()
            ->getRepository('MicroliseSurveyBundle:Survey');
        $survey = $repository->findAll();
        print_r($survey);

        return $this->render(
            'MicroliseSurveyBundle:Survey:create.html.twig',
            array()
        );
    }

    public function analyticsAction()
    {

    }

}