using ScssDemoPortal.Models;
using System.Web.Mvc;

namespace ScssDemoPortal.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                id = "0";
            }
            return View(new ViewModel(id));
        }        
        
        public ActionResult Solution(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                id = "0";
            }
            return View("Index", new ViewModel(id, true));
        }
    }
}